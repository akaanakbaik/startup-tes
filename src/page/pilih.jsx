import { useLocation, useNavigate } from "react-router-dom"

export default function Pilih(){

  const nav = useNavigate()
  const {state}=useLocation()

  const plan = state?.plan

  return(
    <div style={s.body}>
      <div style={s.wrap}>

        <div style={s.card}>
          <div style={s.title}>Konfirmasi Pesanan</div>
          <div>{plan?.name}</div>
          <div>Rp{plan?.price}</div>
        </div>

        <div style={s.title}>Pilih Pembayaran</div>

        <div style={s.item} onClick={()=>nav("/qris",{state:{plan}})}>
          QRIS (ShopeePay)
        </div>

        <div style={s.item} onClick={()=>nav("/dana",{state:{plan}})}>
          DANA
        </div>

        <div style={s.item} onClick={()=>nav("/cc",{state:{plan}})}>
          Credit Card
        </div>

      </div>
    </div>
  )
}

const s={
body:{background:"#0a0a0a",color:"#fff",minHeight:"100vh"},
wrap:{maxWidth:"400px",margin:"auto",padding:"20px"},
title:{marginTop:"15px",fontSize:"14px"},
card:{background:"#171717",padding:"10px",borderRadius:"6px"},
item:{padding:"12px",background:"#111",marginTop:"10px",borderRadius:"6px"}
}