export default function Pilih(){

  const data = JSON.parse(localStorage.getItem("checkout")||"{}")

  function go(path){
    window.location.href=path
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>

      <div style={{width:"320px",background:"#171717",padding:"16px",borderRadius:"8px",border:"1px solid #222"}}>

        <div style={{fontWeight:"700",marginBottom:"10px"}}>
          Checkout
        </div>

        <div style={{fontSize:"12px",marginBottom:"10px"}}>
          {data.name} - {data.ram}
        </div>

        <div style={{fontWeight:"700",marginBottom:"14px"}}>
          Rp {data.price}
        </div>

        <button onClick={()=>go("/qr")} style={btn}>QRIS</button>
        <button onClick={()=>go("/ewalletdana")} style={btn}>DANA</button>
        <button onClick={()=>go("/creditcard")} style={btn}>Credit Card</button>

        <div style={{marginTop:"12px",textAlign:"center",fontSize:"10px",color:"#777"}}>
          payment gateway by <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>duitku</a>
        </div>

      </div>

    </div>
  )
}

const btn={
  width:"100%",
  padding:"8px",
  marginBottom:"6px",
  background:"#2563eb",
  border:"none",
  borderRadius:"5px",
  color:"#fff",
  fontSize:"12px"
}