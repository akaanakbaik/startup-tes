export default function Dana(){

  const data = JSON.parse(localStorage.getItem("checkout")||"{}")
  const fee=1000
  const total=data.price+fee

  function pay(){
    window.location.href="/api/dana"
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>

      <div style={{width:"320px",background:"#171717",padding:"16px",borderRadius:"8px",border:"1px solid #222"}}>

        <div style={{fontWeight:"700",marginBottom:"10px"}}>DANA</div>

        <div style={{fontSize:"12px"}}>Harga: Rp {data.price}</div>
        <div style={{fontSize:"12px"}}>Fee: Rp {fee}</div>

        <div style={{fontWeight:"700",margin:"10px 0"}}>Total: Rp {total}</div>

        <button onClick={pay} style={{
          width:"100%",
          padding:"8px",
          background:"#16a34a",
          border:"none",
          borderRadius:"5px",
          color:"#fff",
          fontSize:"12px"
        }}>
          Bayar Sekarang
        </button>

        <div style={{marginTop:"12px",textAlign:"center",fontSize:"10px",color:"#777"}}>
          payment gateway by <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>duitku</a>
        </div>

      </div>

    </div>
  )
}