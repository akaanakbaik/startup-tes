import { useState, useEffect } from "react"

export default function App(){

  const [plan,setPlan]=useState(null)
  const [method,setMethod]=useState(null)
  const [qr,setQr]=useState(null)
  const [orderId,setOrderId]=useState(null)
  const [status,setStatus]=useState("WAITING")
  const [loading,setLoading]=useState(false)
  const [popup,setPopup]=useState(null)

  const showPopup=(type,message)=>{
    setPopup({type,message})
    setTimeout(()=>setPopup(null),3000)
  }

  const buy=(name,price)=>{
    setPlan({name,price})
    window.location="#checkout"
  }

  const createQR = async () => {
    setLoading(true)

    const res = await fetch("/api/duitku-create",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        name:plan.name,
        price:plan.price,
        email:"storeakadev@gmail.com"
      })
    })

    const data = await res.json()
    setLoading(false)

    if (!data.success) {
      showPopup("error",data.message)
      return
    }

    setQr(data.qrString)
    setOrderId(data.merchantOrderId)
    showPopup("success","QRIS berhasil dibuat")
  }

  useEffect(()=>{
    if(!orderId) return

    const interval = setInterval(async()=>{
      const res = await fetch("/api/duitku-status",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ merchantOrderId:orderId })
      })

      const data = await res.json()

      if(data.statusCode === "00"){
        setStatus("SUCCESS")
        showPopup("success","Pembayaran berhasil")
        clearInterval(interval)
      }

    },5000)

    return ()=>clearInterval(interval)

  },[orderId])

  return(
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">Akadev Store</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {name:"Starter",price:4900},
            {name:"Basic",price:8900},
            {name:"Standard",price:12900},
            {name:"Plus",price:16900}
          ].map(p=>(
            <div key={p.name} className="bg-[#171717] p-4 rounded border border-gray-800">
              <h3>{p.name}</h3>
              <p className="font-bold">Rp{p.price}</p>
              <button onClick={()=>buy(p.name,p.price)} className="mt-2 bg-blue-600 w-full py-2 rounded">
                Beli
              </button>
            </div>
          ))}
        </div>

        {plan && (
          <div id="checkout" className="mt-6 bg-[#171717] p-6 rounded border border-gray-800">

            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-3 rounded text-sm mb-4">
              Sistem pembayaran ini masih dalam tahap uji coba (Sandbox). Jangan melakukan pembayaran nyata.
            </div>

            <p>{plan.name}</p>
            <p className="font-bold mb-4">Rp{plan.price}</p>

            {!method && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setMethod("gopay")} className="bg-[#262626] p-3 rounded">
                  GoPay
                </button>
                <button onClick={()=>setMethod("qris")} className="bg-[#262626] p-3 rounded">
                  QRIS
                </button>
              </div>
            )}

            {method==="gopay" && (
              <div className="mt-4 bg-green-500/10 border border-green-500 text-green-400 p-3 rounded text-sm">
                GoPay sedang dalam tahap pengujian dan belum tersedia.
              </div>
            )}

            {method==="qris" && (
              <div className="mt-4 text-center">

                {!qr && (
                  <button
                    onClick={createQR}
                    className="bg-blue-600 px-4 py-2 rounded"
                  >
                    {loading ? "Memproses..." : "Generate QRIS"}
                  </button>
                )}

                {qr && (
                  <>
                    <div className="bg-white p-4 inline-block rounded">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qr)}`}
                      />
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      QRIS NOBU (Sandbox)
                    </p>

                    <p className="mt-2 text-sm">
                      Status: {status}
                    </p>
                  </>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {popup && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`px-4 py-3 rounded text-sm ${
            popup.type==="error" ? "bg-red-600" : "bg-green-600"
          }`}>
            {popup.message}
          </div>
        </div>
      )}

    </div>
  )
}