import { useEffect, useState } from "react"

export default function QR() {
  const [data,setData]=useState(null)

  useEffect(()=>{
    fetch("/api/qris",{method:"POST"})
    .then(r=>r.json())
    .then(j=>setData(j.data))
  },[])

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.title}>QRIS Payment</div>

        <div style={s.notice}>Jangan scan ini, hanya testing</div>

        {data?.qrString && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data.qrString)}`}
            style={s.qr}
          />
        )}

        <div style={s.status}>Menunggu pembayaran</div>
      </div>
    </div>
  )
}

const s={
wrap:{background:"#0b0b0b",minHeight:"100vh"},
box:{maxWidth:"400px",margin:"auto",padding:"15px",color:"#fff"},
title:{fontSize:"14px"},
notice:{background:"#facc15",color:"#000",padding:"6px",fontSize:"12px",margin:"10px 0"},
qr:{display:"block",margin:"10px auto",background:"#fff",padding:"8px",borderRadius:"8px"},
status:{textAlign:"center",fontSize:"12px",color:"#eab308"}
}