import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function QR(){

  const {state}=useLocation()
  const nav = useNavigate()
  const plan = state?.plan

  const [data,setData]=useState(null)
  const [status,setStatus]=useState("MENUNGGU")
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    fetch("/api/qris",{method:"POST"})
    .then(r=>r.json())
    .then(res=>{
      setData(res)
      setLoading(false)
    })
  },[])

  useEffect(()=>{
    if(!data?.reference) return

    const interval=setInterval(()=>{
      fetch("/api/status",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({orderId:data.reference})
      })
      .then(r=>r.json())
      .then(res=>{
        if(res.status==="SUCCESS"){
          setStatus("SUCCESS")
          clearInterval(interval)
          setTimeout(()=>nav("/"),1500)
        }
      })
    },4000)

    return()=>clearInterval(interval)

  },[data])

  return(
    <div style={s.body}>
      <div style={s.wrap}>

        <div style={s.card}>
          <div style={s.title}>QRIS Payment</div>
          <div style={s.small}>Mode sandbox jangan dibayar</div>
        </div>

        <div style={s.card}>
          <div style={s.row}><span>Produk</span><b>{plan?.name}</b></div>
          <div style={s.row}><span>Total</span><b>Rp{plan?.price}</b></div>
        </div>

        <div style={s.qrBox}>
          {loading && <div style={s.loading}>Memuat...</div>}

          {data?.qrString && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrString)}`}
              style={s.qr}
            />
          )}
        </div>

        <div style={{
          ...s.status,
          color: status==="SUCCESS" ? "#16a34a" : "#facc15"
        }}>
          {status==="SUCCESS" ? "Pembayaran Berhasil" : "Menunggu Pembayaran"}
        </div>

      </div>
    </div>
  )
}

const s={
body:{background:"#0a0a0a",color:"#fff",minHeight:"100vh"},
wrap:{maxWidth:"360px",margin:"auto",padding:"12px"},
card:{background:"#171717",padding:"10px",borderRadius:"6px",marginBottom:"8px"},
title:{fontSize:"13px"},
small:{fontSize:"10px",color:"#aaa"},
row:{display:"flex",justifyContent:"space-between",fontSize:"12px"},
qrBox:{display:"flex",justifyContent:"center",padding:"10px"},
qr:{background:"#fff",padding:"6px",borderRadius:"8px"},
loading:{fontSize:"12px",color:"#aaa"},
status:{textAlign:"center",fontSize:"12px",marginTop:"10px"}
}