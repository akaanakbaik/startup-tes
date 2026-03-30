export default function CreditCard(){

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",padding:"16px"}}>

      <div style={{
        width:"100%",
        maxWidth:"320px",
        background:"#171717",
        border:"1px solid #222",
        borderRadius:"8px",
        padding:"14px",
        fontSize:"12px"
      }}>

        <div style={{marginBottom:"10px",fontWeight:"600"}}>
          Credit Card
        </div>

        <div style={{color:"#888",marginBottom:"12px"}}>
          Visa / Mastercard / JCB
        </div>

        <input placeholder="Nomor kartu" style={input}/>
        <input placeholder="MM/YY" style={input}/>
        <input placeholder="CVV" style={input}/>

        <button style={{
          width:"100%",
          padding:"8px",
          background:"#2563eb",
          border:"none",
          borderRadius:"5px",
          color:"#fff",
          marginTop:"10px",
          fontSize:"12px"
        }}>
          Bayar
        </button>

        <div style={{marginTop:"12px",textAlign:"center",fontSize:"10px",color:"#777"}}>
          payment gateway by{" "}
          <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>
            duitku
          </a>
        </div>

      </div>
    </div>
  )
}

const input={
  width:"100%",
  padding:"6px",
  marginBottom:"6px",
  background:"#0a0a0a",
  border:"1px solid #333",
  borderRadius:"4px",
  color:"#fff",
  fontSize:"11px"
}