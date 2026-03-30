import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Utama(){

  const nav = useNavigate()
  const [modal,setModal]=useState(false)
  const [loading,setLoading]=useState(false)

  const buy = (plan)=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      nav("/pilih",{state:{plan}})
    },800)
  }

  return(
    <div style={s.body}>

      <header style={s.topbar}>
        <div style={s.wrap}>
          <div style={s.brand}>
            <img src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/file_000000000dec71faa172d7d8d6e29392.png" style={s.logo}/>
            <div>
              <div style={s.title}>Akadev Store</div>
              <div style={s.sub}>High-Performance Pterodactyl Panel</div>
            </div>
          </div>
        </div>
      </header>

      <section style={s.hero}>
        <div style={s.wrap}>
          <h1 style={s.h1}>Deploy Server dalam Hitungan Detik</h1>
          <p style={s.p}>Stabil, cepat, profesional</p>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.wrap}>
          <div style={s.grid}>

            {plans.map((p,i)=>(
              <div key={i} style={s.card}>
                <div style={s.planName}>{p.name}</div>
                <div style={s.price}>Rp{p.price}</div>

                <div style={s.spec}>RAM {p.ram}</div>
                <div style={s.spec}>CPU {p.cpu}</div>
                <div style={s.spec}>Disk {p.disk}</div>

                <button style={s.btn} onClick={()=>buy(p)}>
                  {loading ? "Loading..." : "Beli"}
                </button>
              </div>
            ))}

          </div>
        </div>
      </section>

      {modal && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            Sistem dalam pengembangan
            <button onClick={()=>setModal(false)}>Tutup</button>
          </div>
        </div>
      )}

    </div>
  )
}

const plans=[
{name:"Starter",price:"4900",ram:"1GB",cpu:"40%",disk:"2GB"},
{name:"Basic",price:"8900",ram:"2GB",cpu:"60%",disk:"4GB"},
{name:"Standard",price:"12900",ram:"3GB",cpu:"80%",disk:"5GB"},
{name:"Plus",price:"16900",ram:"4GB",cpu:"100%",disk:"8GB"},
{name:"Pro",price:"19900",ram:"6GB",cpu:"120%",disk:"12GB"},
{name:"Advanced",price:"27900",ram:"8GB",cpu:"150%",disk:"15GB"},
{name:"Ultra",price:"34900",ram:"10GB",cpu:"200%",disk:"20GB"},
{name:"Max",price:"49900",ram:"Unlimited",cpu:"Unlimited",disk:"Unlimited"}
]

const s={
body:{background:"#0a0a0a",color:"#fff",minHeight:"100vh"},
wrap:{maxWidth:"1100px",margin:"auto",padding:"20px"},
topbar:{borderBottom:"1px solid #333"},
brand:{display:"flex",gap:"10px",alignItems:"center"},
logo:{width:"36px",height:"36px",borderRadius:"50%"},
title:{fontSize:"14px",fontWeight:"700"},
sub:{fontSize:"11px",color:"#aaa"},
hero:{padding:"40px 0"},
h1:{fontSize:"24px"},
p:{color:"#aaa"},
section:{padding:"20px 0"},
grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px"},
card:{background:"#171717",padding:"12px",borderRadius:"8px"},
planName:{fontSize:"14px"},
price:{fontSize:"18px",fontWeight:"700"},
spec:{fontSize:"11px",color:"#aaa"},
btn:{marginTop:"10px",padding:"8px",background:"#2563eb",border:"none",color:"#fff",borderRadius:"6px"},
modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",justifyContent:"center",alignItems:"center"},
modalBox:{background:"#111",padding:"20px"}
}