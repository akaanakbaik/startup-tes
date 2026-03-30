import { useEffect, useState } from "react"

export default function QR(){

  const [loading,setLoading]=useState(true)
  const [error,setError]=useState("")
  const [data,setData]=useState(null)
  const [status,setStatus]=useState("PENDING")

  useEffect(()=>{
    create()
  },[])

  async function create(){

    try{

      setLoading(true)
      setError("")

      const res = await fetch("/api/qris",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          plan:"Paket Server",
          amount:40000
        })
      })

      const text = await res.text()

      let json
      try{
        json = JSON.parse(text)
      }catch{
        setError("Server tidak valid")
        setLoading(false)
        return
      }

      if(!res.ok || json.error){
        setError(json.message || "Gagal membuat QR")
        setLoading(false)
        return
      }

      setData(json)
      setLoading(false)

      startPolling(json.orderId)

    }catch(e){
      setError("Gagal koneksi server")
      setLoading(false)
    }

  }

  function startPolling(orderId){

    const interval = setInterval(async()=>{

      try{

        const res = await fetch("/api/status",{
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body:JSON.stringify({orderId})
        })

        const json = await res.json()

        setStatus(json.status)

        if(json.status==="SUCCESS"){
          clearInterval(interval)
          alert("Pembayaran berhasil")
        }

        if(json.status==="CANCELED"){
          clearInterval(interval)
          alert("Pembayaran dibatalkan")
        }

      }catch{}

    },5000)

  }

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0a0a0a",
      padding:"16px"
    }}>

      <div style={{
        width:"100%",
        maxWidth:"320px",
        background:"#171717",
        border:"1px solid #333",
        borderRadius:"8px",
        padding:"16px",
        textAlign:"center"
      }}>

        <div style={{
          fontSize:"12px",
          color:"#f59e0b",
          marginBottom:"10px"
        }}>
          MODE TEST - JANGAN LAKUKAN PEMBAYARAN
        </div>

        {loading && (
          <div style={{fontSize:"12px",color:"#aaa"}}>
            Membuat QR...
          </div>
        )}

        {error && (
          <div style={{
            fontSize:"12px",
            color:"#ef4444"
          }}>
            {error}
          </div>
        )}

        {data && (
          <>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data.qrString)}`}
              style={{
                width:"180px",
                margin:"0 auto",
                marginBottom:"12px"
              }}
            />

            <div style={{
              fontSize:"12px",
              color:"#aaa",
              marginBottom:"6px"
            }}>
              Nominal
            </div>

            <div style={{
              fontSize:"14px",
              fontWeight:"600",
              marginBottom:"10px"
            }}>
              Rp {data.amount}
            </div>

            <div style={{
              fontSize:"11px",
              color:"#888",
              marginBottom:"10px"
            }}>
              Scan menggunakan aplikasi apapun
            </div>

            <div style={{
              fontSize:"11px",
              marginBottom:"6px"
            }}>
              Status
            </div>

            <div style={{
              fontSize:"12px",
              fontWeight:"600",
              color:
                status==="SUCCESS" ? "#22c55e" :
                status==="PENDING" ? "#f59e0b" :
                "#ef4444"
            }}>
              {status}
            </div>

          </>
        )}

      </div>

    </div>
  )
}