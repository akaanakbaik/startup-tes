import { useState } from "react"

export default function CreditCard(){

  const data = JSON.parse(localStorage.getItem("checkout")||"{}")
  const fee = Math.round(data.price * 0.03) || 0
  const total = (data.price||0) + fee

  const [form,setForm]=useState({
    number:"",
    name:"",
    exp:"",
    cvv:""
  })

  function change(e){
    setForm({...form,[e.target.name]:e.target.value})
  }

  function pay(){
    if(!form.number || !form.name || !form.exp || !form.cvv){
      alert("Lengkapi data kartu")
      return
    }
    fetch("/api/creditcard",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ total })
    }).then(()=>alert("Simulasi pembayaran berhasil"))
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>

      <div style={{width:"320px",background:"#171717",padding:"16px",borderRadius:"8px",border:"1px solid #222"}}>

        <div style={{fontWeight:"700",marginBottom:"10px"}}>Credit Card</div>

        <div style={{fontSize:"12px"}}>Harga: Rp {data.price}</div>
        <div style={{fontSize:"12px"}}>Fee: Rp {fee}</div>

        <div style={{fontWeight:"700",margin:"10px 0"}}>Total: Rp {total}</div>

        <input name="number" onChange={change} placeholder="Nomor kartu" style={input}/>
        <input name="name" onChange={change} placeholder="Nama pemilik" style={input}/>
        <input name="exp" onChange={change} placeholder="MM/YY" style={input}/>
        <input name="cvv" onChange={change} placeholder="CVV" style={input}/>

        <button onClick={pay} style={btn}>
          Bayar
        </button>

        <div style={{marginTop:"12px",textAlign:"center",fontSize:"10px",color:"#777"}}>
          payment gateway by <a href="https://duitku.com" target="_blank" style={{color:"#1e3a8a"}}>duitku</a>
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

const btn={
  width:"100%",
  padding:"8px",
  background:"#2563eb",
  border:"none",
  borderRadius:"5px",
  color:"#fff",
  fontSize:"12px"
}