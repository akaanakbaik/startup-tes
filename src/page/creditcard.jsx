import { useEffect,useState } from "react"

export default function CC(){

  const [url,setUrl]=useState(null)

  useEffect(()=>{
    fetch("/api/creditcard",{method:"POST"})
    .then(r=>r.json())
    .then(res=>{
      if(res.paymentUrl){
        window.location.href=res.paymentUrl
      }
    })
  },[])

  return(
    <div style={s.body}>
      <div style={s.wrap}>
        <div style={s.text}>Mengalihkan ke pembayaran...</div>
      </div>
    </div>
  )
}

const s={
body:{background:"#0a0a0a",color:"#fff",minHeight:"100vh"},
wrap:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},
text:{fontSize:"13px"}
}