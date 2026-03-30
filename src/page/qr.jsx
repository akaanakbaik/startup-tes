import { useEffect, useState } from "react"

export default function QR(){

  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [status,setStatus]=useState("PENDING")

  const checkout = JSON.parse(localStorage.getItem("checkout")||"null")

  useEffect(()=>{

    if(!checkout){
      setLoading(false)
      return
    }

    fetch("/api/qris",{method:"POST"})
    .then(r=>r.json())
    .then(res=>{
      setData(res)
      setLoading(false)

      if(res.orderId){
        setInterval(()=>{
          fetch("/api/status",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({orderId:res.orderId})
          })
          .then(r=>r.json())
          .then(s=>{
            setStatus(s.status)
            if(s.status==="SUCCESS") window.location.href="/success"
            if(s.status==="CANCELED") window.location.href="/failed"
          })
        },5000)
      }
    })
    .catch(()=>{
      setLoading(false)
    })

  },[])

  if(!checkout){
    return <Center text="Data transaksi tidak ditemukan"/>
  }

  if(loading){
    return <Center text="Memuat pembayaran..."/>
  }

  if(!data){
    return <Center text="Gagal membuat pembayaran"/>
  }

  const fee = Math.round(checkout.price*0.01)
  const total = checkout.price + fee

  return (
    <Wrap>

      <Box>

        <Title>QRIS Payment</Title>

        <Text>Total: Rp {total}</Text>
        <Text>Fee: Rp {fee}</Text>

        <QRBox>
          {data.qrString}
        </QRBox>

        <Btn onClick={()=>window.location.reload()}>
          Refresh Status
        </Btn>

        <Status status={status}/>

        <WM/>

      </Box>

    </Wrap>
  )
}

function Center({text}){
  return (
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0a",color:"#fff"}}>
      {text}
    </div>
  )
}

function Wrap({children}){
  return <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>{children}</div>
}

function Box({children}){
  return <div style={{width:"320px",background:"#171717",padding:"14px",borderRadius:"8px",border:"1px solid #222"}}>{children}</div>
}

function Title({children}){
  return <div style={{fontWeight:"700",marginBottom:"8px"}}>{children}</div>
}

function Text({children}){
  return <div style={{fontSize:"11px",marginBottom:"4px"}}>{children}</div>
}

function QRBox({children}){
  return <div style={{background:"#fff",color:"#000",padding:"8px",margin:"10px 0",fontSize:"8px"}}>{children}</div>
}

function Btn({children,...props}){
  return <button {...props} style={{width:"100%",padding:"8px",background:"#2563eb",border:"none",borderRadius:"5px",color:"#fff",fontSize:"12px"}}>{children}</button>
}

function Status({status}){
  return <div style={{textAlign:"center",marginTop:"8px",color:status==="SUCCESS"?"#16a34a":"#f59e0b"}}>{status}</div>
}

function WM(){
  return <div style={{marginTop:"10px",textAlign:"center",fontSize:"10px",color:"#777"}}>
    payment gateway by <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>duitku</a>
  </div>
}