export default function CC(){
  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.title}>Credit Card</div>
        <div style={s.desc}>Redirect ke Duitku</div>
      </div>
    </div>
  )
}

const s={
wrap:{minHeight:"100vh",background:"#0b0b0b"},
box:{maxWidth:"400px",margin:"auto",padding:"15px",color:"#fff"},
title:{fontSize:"14px"},
desc:{fontSize:"12px",color:"#888"}
}