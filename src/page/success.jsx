export default function Success(){
  return (
    <div style={{background:"#0a0a0a",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>

      <div style={{background:"#171717",padding:"20px",borderRadius:"8px",textAlign:"center"}}>

        <div style={{fontSize:"18px",color:"#16a34a"}}>Pembayaran Berhasil</div>

        <div style={{marginTop:"10px",fontSize:"12px"}}>
          Terima kasih, transaksi kamu sudah selesai
        </div>

        <button style={{marginTop:"12px",padding:"8px",width:"100%",background:"#2563eb",color:"#fff",border:"none"}}>
          Kembali
        </button>

      </div>

    </div>
  )
}