import { useState } from "react"

export default function Utama(){

  const [open,setOpen]=useState(false)

  function go(){
    window.location.href="/pilih"
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",color:"#e5e5e5",fontSize:"13px"}}>

      <div style={{maxWidth:"1000px",margin:"0 auto",padding:"16px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <div style={{fontWeight:"700"}}>Akadev Store</div>
          <div style={{fontSize:"11px",color:"#888"}}>Sandbox</div>
        </div>

        <div style={{marginBottom:"20px"}}>
          <div style={{fontSize:"18px",fontWeight:"700",marginBottom:"6px"}}>
            Deploy Server Instan
          </div>
          <div style={{color:"#888",fontSize:"12px"}}>
            Panel Pterodactyl stabil untuk bot dan server ringan
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px"}}>

          {[
            {name:"Starter",price:4900},
            {name:"Basic",price:8900},
            {name:"Standard",price:12900},
            {name:"Pro",price:19900}
          ].map((p,i)=>(
            <div key={i} style={{
              border:"1px solid #222",
              borderRadius:"6px",
              padding:"10px",
              background:"#171717"
            }}>
              <div style={{fontWeight:"600",fontSize:"12px"}}>{p.name}</div>
              <div style={{fontSize:"11px",color:"#888"}}>1-6GB RAM</div>
              <div style={{margin:"6px 0",fontWeight:"700"}}>Rp {p.price}</div>

              <button onClick={go} style={{
                width:"100%",
                padding:"6px",
                fontSize:"11px",
                background:"#2563eb",
                border:"none",
                borderRadius:"4px",
                color:"#fff"
              }}>
                Beli
              </button>
            </div>
          ))}

        </div>

        <div style={{marginTop:"30px",textAlign:"center",fontSize:"10px",color:"#777"}}>
          payment gateway by{" "}
          <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>
            duitku
          </a>
        </div>

      </div>
    </div>
  )
}