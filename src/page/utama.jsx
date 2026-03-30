import { useState } from "react"

export default function Utama(){

  const katalog=[
    {name:"Starter",ram:"1GB",price:5000},
    {name:"Basic",ram:"2GB",price:9000},
    {name:"Standard",ram:"3GB",price:13000},
    {name:"Plus",ram:"4GB",price:17000},
    {name:"Pro",ram:"6GB",price:20000},
    {name:"Advanced",ram:"8GB",price:28000},
    {name:"Ultra",ram:"10GB",price:35000},
    {name:"Max",ram:"Unlimited",price:50000},
    {name:"Bot",ram:"512MB",price:3000},
    {name:"Lite",ram:"768MB",price:4000},
    {name:"Game",ram:"12GB",price:60000},
    {name:"Enterprise",ram:"Unlimited",price:100000}
  ]

  function buy(p){
    localStorage.setItem("checkout",JSON.stringify(p))
    window.location.href="/pilih"
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",color:"#e5e5e5",fontSize:"13px"}}>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"16px"}}>

        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px"}}>
          <img src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/file_000000000dec71faa172d7d8d6e29392.png" style={{width:"30px",height:"30px",borderRadius:"50%"}}/>
          <div>
            <div style={{fontWeight:"700"}}>Akadev Store</div>
            <div style={{fontSize:"11px",color:"#888"}}>Pterodactyl Panel</div>
          </div>
        </div>

        <div style={{marginBottom:"20px"}}>
          <div style={{fontSize:"18px",fontWeight:"700",marginBottom:"6px"}}>
            Layanan Hosting Panel Profesional
          </div>
          <div style={{color:"#888",fontSize:"12px"}}>
            Server stabil untuk bot, aplikasi, dan game. Infrastruktur cepat dan aman.
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>

          {katalog.map((p,i)=>(
            <div key={i} style={{
              border:"1px solid #222",
              borderRadius:"6px",
              padding:"10px",
              background:"#171717"
            }}>
              <div style={{fontWeight:"600",fontSize:"12px"}}>{p.name}</div>
              <div style={{fontSize:"11px",color:"#888"}}>{p.ram}</div>
              <div style={{margin:"6px 0",fontWeight:"700"}}>Rp {p.price}</div>

              <button onClick={()=>buy(p)} style={{
                width:"100%",
                padding:"6px",
                fontSize:"11px",
                background:"#2563eb",
                border:"none",
                borderRadius:"4px",
                color:"#fff"
              }}>
                Checkout
              </button>
            </div>
          ))}

        </div>

        <div style={{marginTop:"30px",fontSize:"11px",color:"#aaa"}}>
          Support: storeakadev@gmail.com | 081266950382 | Indonesia
        </div>

      </div>
    </div>
  )
}