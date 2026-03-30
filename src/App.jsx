import { useState, useEffect } from "react"

const plans = [
  { name:"Starter", price:10000, ram:"1GB", cpu:"40%", disk:"2GB" },
  { name:"Basic", price:15000, ram:"2GB", cpu:"60%", disk:"4GB" },
  { name:"Standard", price:20000, ram:"3GB", cpu:"80%", disk:"5GB" },
  { name:"Plus", price:25000, ram:"4GB", cpu:"100%", disk:"8GB" },
  { name:"Pro", price:30000, ram:"6GB", cpu:"120%", disk:"12GB" },
  { name:"Advanced", price:40000, ram:"8GB", cpu:"150%", disk:"15GB" }
]

export default function App(){
  const [step,setStep]=useState("catalog")
  const [selected,setSelected]=useState(null)
  const [email,setEmail]=useState("")
  const [method,setMethod]=useState("")
  const [loading,setLoading]=useState(false)
  const [notif,setNotif]=useState("")
  const [qr,setQr]=useState("")
  const [orderId,setOrderId]=useState("")
  const [status,setStatus]=useState("Menunggu pembayaran")

  const createPayment=async()=>{
    if(!email) return setNotif("Email wajib diisi")
    if(!method) return setNotif("Pilih metode pembayaran")

    setLoading(true)
    setNotif("Membuat transaksi...")

    try{
      const res=await fetch("/api/duitku-create",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          name:selected.name,
          price:selected.price,
          email,
          method
        })
      })

      const data=await res.json()

      if(!data.success){
        setNotif(data.message || "Transaksi gagal")
        setLoading(false)
        return
      }

      setQr(data.qrString)
      setOrderId(data.merchantOrderId)
      setStep("payment")
      setNotif("Transaksi dibuat")

    }catch{
      setNotif("Server error")
    }

    setLoading(false)
  }

  useEffect(()=>{
    if(step==="payment" && orderId){
      const i=setInterval(async()=>{
        try{
          const r=await fetch("/api/duitku-status",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({ merchantOrderId:orderId })
          })
          const d=await r.json()
          if(d.statusCode==="00"){
            setStatus("Pembayaran berhasil")
            setNotif("Transaksi sukses")
            clearInterval(i)
          }
        }catch{}
      },5000)
      return()=>clearInterval(i)
    }
  },[step,orderId])

  return(
    <div className="bg-neutral-950 text-neutral-200 min-h-screen text-sm">

      <header className="border-b border-neutral-800 px-4 py-3 flex justify-between items-center">
        <div className="font-semibold text-xs">Akadev Store</div>
        <div className="text-[10px] text-yellow-400">Sandbox Mode</div>
      </header>

      <div className="max-w-5xl mx-auto px-3 py-4">

        {notif && (
          <div className="mb-3 text-[11px] bg-blue-600 px-3 py-2 rounded">
            {notif}
          </div>
        )}

        {step==="catalog" && (
          <div>

            <div className="mb-4">
              <div className="text-base font-semibold mb-1">Paket Server</div>
              <div className="text-[11px] text-neutral-400">
                Pilih paket sesuai kebutuhan bot atau aplikasi kamu
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {plans.map((p,i)=>(
                <div key={i} className="border border-neutral-800 rounded p-3 hover:border-blue-500 transition">

                  <div className="font-semibold text-xs mb-1">{p.name}</div>
                  <div className="text-[10px] text-neutral-400 mb-2">
                    {p.ram} • {p.cpu} • {p.disk}
                  </div>

                  <div className="font-semibold text-xs mb-2">
                    Rp {p.price.toLocaleString()}
                  </div>

                  <button
                    onClick={()=>{ setSelected(p); setStep("checkout") }}
                    className="w-full bg-blue-600 text-[11px] py-1 rounded"
                  >
                    Pilih
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}

        {step==="checkout" && selected && (
          <div className="max-w-sm mx-auto">

            <div className="mb-4">
              <div className="font-semibold text-sm">Checkout</div>
              <div className="text-[11px] text-neutral-400">
                Lengkapi data untuk melanjutkan pembayaran
              </div>
            </div>

            <div className="border border-neutral-800 p-3 rounded mb-3">
              <div className="text-xs">{selected.name}</div>
              <div className="text-[11px] text-neutral-400">
                Rp {selected.price.toLocaleString()}
              </div>
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-2 p-2 rounded bg-neutral-900 border border-neutral-700 text-[11px]"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />

            <div className="mb-3">
              <div className="text-[11px] mb-1">Metode Pembayaran</div>

              <div className="grid grid-cols-2 gap-2">

                <button
                  onClick={()=>setMethod("SP")}
                  className={`p-2 border rounded text-[11px] ${method==="SP"?"border-blue-500":"border-neutral-700"}`}
                >
                  QRIS (Shopee)
                </button>

                <button
                  onClick={()=>setMethod("NQ")}
                  className={`p-2 border rounded text-[11px] ${method==="NQ"?"border-blue-500":"border-neutral-700"}`}
                >
                  QRIS (Nobu)
                </button>

              </div>

            </div>

            <button
              onClick={createPayment}
              disabled={loading}
              className="w-full bg-green-600 py-2 text-[11px] rounded"
            >
              {loading?"Processing...":"Bayar Sekarang"}
            </button>

            <button
              onClick={()=>setStep("catalog")}
              className="w-full mt-2 border border-neutral-700 py-1 text-[11px] rounded"
            >
              Kembali
            </button>

          </div>
        )}

        {step==="payment" && (
          <div className="max-w-sm mx-auto text-center">

            <div className="mb-3">
              <div className="font-semibold text-sm">Pembayaran</div>
              <div className="text-[11px] text-neutral-400">
                Scan QR untuk melakukan pembayaran
              </div>
            </div>

            <div className="bg-yellow-500 text-black text-[10px] p-2 rounded mb-3">
              Ini adalah mode uji coba. Jangan lakukan pembayaran nyata.
            </div>

            {qr && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200`}
                className="mx-auto mb-3"
              />
            )}

            <div className="text-[11px] text-neutral-400 mb-1">
              Status Transaksi
            </div>

            <div className="text-green-400 text-xs mb-3">
              {status}
            </div>

            <button
              onClick={()=>{ setStep("catalog"); setQr(""); setStatus("Menunggu pembayaran") }}
              className="w-full border border-neutral-700 py-1 text-[11px] rounded"
            >
              Kembali
            </button>

          </div>
        )}

      </div>

      <footer className="border-t border-neutral-800 text-center text-[10px] text-neutral-500 p-3">
        support@akadev.xyz • 081266950382 • Indonesia
      </footer>

    </div>
  )
}