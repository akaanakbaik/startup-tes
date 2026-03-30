import { useNavigate } from "react-router-dom"

export default function Utama() {
  const nav = useNavigate()

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.title}>Akadev Store</div>
        <div style={s.desc}>Sistem pembayaran sandbox</div>

        <div style={s.notice}>
          Mode uji coba. Jangan lakukan pembayaran nyata.
        </div>

        <button style={s.btn} onClick={() => nav("/pilih")}>
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight:"100vh", background:"#0b0b0b", display:"flex", alignItems:"center", justifyContent:"center" },
  box: { width:"100%", maxWidth:"380px", padding:"20px", color:"#fff" },
  title: { fontSize:"18px", fontWeight:"600" },
  desc: { fontSize:"12px", color:"#888", marginBottom:"10px" },
  notice: { background:"#facc15", color:"#000", padding:"8px", fontSize:"12px", borderRadius:"6px" },
  btn: { marginTop:"15px", width:"100%", padding:"10px", background:"#111", border:"1px solid #333", color:"#fff", borderRadius:"6px" }
}