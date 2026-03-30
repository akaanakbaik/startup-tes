import { useNavigate } from "react-router-dom"

export default function Pilih() {
  const nav = useNavigate()

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.title}>Pilih Metode Pembayaran</div>

        <div style={s.item} onClick={()=>nav("/qris")}>
          QRIS (ShopeePay)
        </div>

        <div style={s.item} onClick={()=>nav("/cc")}>
          Credit Card
        </div>

        <div style={s.item} onClick={()=>nav("/dana")}>
          DANA
        </div>

        <button style={s.back} onClick={()=>nav("/")}>Kembali</button>
      </div>
    </div>
  )
}

const s = {
  wrap:{minHeight:"100vh",background:"#0b0b0b"},
  box:{maxWidth:"400px",margin:"auto",padding:"15px",color:"#fff"},
  title:{fontSize:"14px",marginBottom:"10px"},
  item:{padding:"12px",border:"1px solid #222",marginBottom:"8px",borderRadius:"6px",fontSize:"13px"},
  back:{marginTop:"10px",width:"100%",padding:"10px",background:"#111",border:"1px solid #333",color:"#fff"}
}