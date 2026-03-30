import { useEffect, useState } from "react"

export default function QR(){

  const [data,setData]=useState(null)
  const [error,setError]=useState("")
  const [status,setStatus]=useState("PENDING")

  const checkout = JSON.parse(localStorage.getItem("checkout")||"null")

  useEffect(()=>{

    if(!checkout){
      setError("Data checkout tidak ada")
      return
    }

    fetch("/api/qris",{method:"POST"})
    .then(r=>r.json())
    .then(res=>{
      if(res.error){
        setError(res.error)
        return
      }

      setData(res)

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
          if(s.status==="FAILED") window.location.href="/failed"
        })
      },5000)

    })
    .catch(()=>{
      setError("Gagal koneksi server")
    })

  },[])

  if(error){
    return <Center text={error}/>
  }

  if(!checkout){
    return <Center text="Checkout kosong"/>
  }

  if(!data){
    return <Center text="Membuat pembayaran..."/>
  }

  const fee = Math.round(checkout.price*0.01)
  const total = checkout.price + fee

  return (
    <Wrap>

      <Box>

        <Title>Pembayaran QRIS</Title>

        <Text>Total Rp {total}</Text>
        <Text>Fee Rp {fee}</Text>

        <QRBox>{data.qrString}</QRBox>

        <Status status={status}/>

        <WM/>

      </Box>

    </Wrap>
  )
}

function Center({text}){
  return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000",color:"#fff"}}>{text}</div>
}

function Wrap({children}){
  return <div style={{background:"#0a0a0a",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>{children}</div>
}

function Box({children}){
  return <div style={{width:"320px",background:"#171717",padding:"14px",borderRadius:"8px"}}>{children}</div>
}

function Title({children}){
  return <div style={{fontWeight:"700",marginBottom:"8px"}}>{children}</div>
}

function Text({children}){
  return <div style={{fontSize:"11px"}}>{children}</div>
}

function QRBox({children}){
  return <div style={{background:"#fff",color:"#000",padding:"8px",margin:"10px 0",fontSize:"8px"}}>{children}</div>
}

function Status({status}){
  return <div style={{textAlign:"center",marginTop:"8px",color:"#16a34a"}}>{status}</div>
}

function WM(){
  return <div style={{marginTop:"10px",textAlign:"center",fontSize:"10px"}}>
    payment gateway by <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>duitku</a>
  </div>
}