import { useEffect,useState } from "react"

export default function QR(){

  const [data,setData]=useState(null)
  const [status,setStatus]=useState("PENDING")

  useEffect(()=>{
    create()
  },[])

  async function create(){

    const res = await fetch("/api/qris",{method:"POST"})
    const json = await res.json()

    setData(json)

    setInterval(check,5000,json.orderId)
  }

  async function check(orderId){
    const r = await fetch("/api/status",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({orderId})
    })
    const j = await r.json()
    setStatus(j.status)
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>

      <div style={{width:"320px",background:"#171717",padding:"16px",borderRadius:"8px",border:"1px solid #222",textAlign:"center"}}>

        {data && (
          <>
            <div style={{fontWeight:"700"}}>Total</div>
            <div style={{marginBottom:"6px"}}>Rp {data.amount}</div>
            <div style={{fontSize:"11px",color:"#888",marginBottom:"10px"}}>Fee Rp0</div>

            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrString)}`} style={{margin:"0 auto"}}/>

            <div style={{marginTop:"10px",fontSize:"12px"}}>
              Status: {status}
            </div>

            <button style={{marginTop:"10px",padding:"6px",fontSize:"11px"}} onClick={()=>check(data.orderId)}>
              Cek Status
            </button>
          </>
        )}

        <div style={{marginTop:"12px",fontSize:"10px",color:"#777"}}>
          payment gateway by <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>duitku</a>
        </div>

      </div>

    </div>
  )
}