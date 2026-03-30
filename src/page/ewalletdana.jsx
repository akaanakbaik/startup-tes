export default function Dana(){

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",padding:"16px"}}>

      <div style={{
        width:"100%",
        maxWidth:"320px",
        background:"#171717",
        border:"1px solid #222",
        borderRadius:"8px",
        padding:"14px",
        fontSize:"12px",
        textAlign:"center"
      }}>

        <div style={{fontWeight:"600",marginBottom:"6px"}}>
          DANA Payment
        </div>

        <div style={{color:"#888",marginBottom:"12px"}}>
          Pembayaran via aplikasi DANA
        </div>

        <button style={{
          width:"100%",
          padding:"8px",
          background:"#16a34a",
          border:"none",
          borderRadius:"5px",
          color:"#fff",
          fontSize:"12px"
        }}>
          Buka DANA
        </button>

        <div style={{marginTop:"12px",fontSize:"10px",color:"#777"}}>
          payment gateway by{" "}
          <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>
            duitku
          </a>
        </div>

      </div>
    </div>
  )
}