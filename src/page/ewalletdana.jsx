import { useEffect } from "react"

export default function Dana(){

  useEffect(()=>{
    fetch("/api/dana",{method:"POST"})
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
        <div style={s.text}>Menghubungkan ke DANA...</div>
      </div>
    </div>
  )
}

const s={
body:{background:"#0a0a0a",color:"#fff",minHeight:"100vh"},
wrap:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},
text:{fontSize:"13px"}
}