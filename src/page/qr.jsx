import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function QR(){

  const {state}=useLocation()
  const plan = state?.plan

  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [status,setStatus]=useState("MENUNGGU PEMBAYARAN")

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
    const i=setInterval(()=>{
      fetch("/api/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:data.reference})})
      .then(r=>r.json())
      .then(s=>{
        if(s.status==="SUCCESS"){
          setStatus("PEMBAYARAN BERHASIL")
          clearInterval(i)
        }
      })
    },5000)
    return()=>clearInterval(i)
  },[data])

  return(
    <div style={s.body}>
      <div style={s.wrap}>

        <div style={s.card}>
          <div style={s.title}>QRIS Payment</div>
          <div style={s.small}>Jangan scan ini jika bukan testing</div>
        </div>

        <div style={s.card}>
          <div style={s.row}>
            <span>Produk</span>
            <strong>{plan?.name}</strong>
          </div>
          <div style={s.row}>
            <span>Total</span>
            <strong>Rp{plan?.price}</strong>
          </div>
        </div>

        <div style={s.qrBox}>
          {loading && <div style={s.loading}>Memuat QR...</div>}

          {data?.qrString && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrString)}`}
              style={s.qr}
            />
          )}
        </div>

        <div style={s.status}>{status}</div>

      </div>
    </div>
  )
}

const s={
body:{background:"#0a0a0a",color:"#fff",minHeight:"100vh"},
wrap:{maxWidth:"360px",margin:"auto",padding:"12px"},
card:{background:"#171717",padding:"10px",borderRadius:"6px",marginBottom:"8px"},
title:{fontSize:"13px",fontWeight:"600"},
small:{fontSize:"10px",color:"#aaa"},
row:{display:"flex",justifyContent:"space-between",fontSize:"12px",marginTop:"4px"},
qrBox:{display:"flex",justifyContent:"center",padding:"10px"},
qr:{background:"#fff",padding:"6px",borderRadius:"8px"},
loading:{fontSize:"12px",color:"#aaa"},
status:{textAlign:"center",fontSize:"12px",marginTop:"10px",color:"#facc15"}
}