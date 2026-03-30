import { useState } from "react"
import { CONFIG } from "./config"

export default function App(){
  const [plan,setPlan]=useState(null)
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

  const pay=async()=>{
    setLoading(true)

    try {
      const res = await fetch(CONFIG.api,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:plan.name,
          price:plan.price,
          email:"storeakadev@gmail.com"
        })
      })

      const data = await res.json()

      if (!data.success) {
        showPopup("error", data.message || "Terjadi kesalahan")
        setLoading(false)
        return
      }

      showPopup("success","Mengalihkan ke pembayaran...")

      setTimeout(()=>{
        window.location = data.paymentUrl
      },1500)

    } catch {
      showPopup("error","Gagal terhubung ke server")
      setLoading(false)
    }
  }

  return(
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      <header className="border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/file_000000000dec71faa172d7d8d6e29392.png" className="w-9 h-9 rounded-full"/>
            <div>
              <p className="text-sm font-bold">Akadev Store</p>
              <p className="text-xs text-gray-400">High-Performance Pterodactyl Panel</p>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Deploy Server Bot & Game Kamu dalam Hitungan Detik
        </h1>
        <p className="text-gray-400 text-sm">
          Infrastruktur hosting panel Pterodactyl dengan performa tinggi dan stabil.
        </p>
      </section>

      <section className="max-w-6xl mx-auto p-6 grid md:grid-cols-4 grid-cols-2 gap-4">
        {[
          {name:"Starter",price:4900},
          {name:"Basic",price:8900},
          {name:"Standard",price:12900},
          {name:"Plus",price:16900}
        ].map(p=>(
          <div key={p.name} className="bg-[#171717] p-4 rounded border border-gray-800 hover:border-gray-600 transition">
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-xl font-bold mt-1">Rp{p.price}</p>
            <button onClick={()=>buy(p.name,p.price)} className="mt-3 bg-blue-600 w-full py-2 rounded hover:bg-blue-700 transition">
              Beli Sekarang
            </button>
          </div>
        ))}
      </section>

      <section id="checkout" className="max-w-xl mx-auto p-6">
        {plan && (
          <div className="bg-[#171717] p-6 rounded border border-gray-800">
            <h2 className="font-bold mb-2">Checkout</h2>
            <p>{plan.name}</p>
            <p className="mb-2">Rp{plan.price}</p>

            <div className="bg-blue-500/10 border border-blue-500 text-blue-400 p-3 rounded mt-3 text-sm">
              Sistem pembayaran telah terintegrasi dan berjalan dalam mode pengujian (Sandbox).
            </div>

            <input placeholder="Nama Lengkap" className="w-full mt-3 p-2 bg-black border border-gray-700"/>
            <input placeholder="Email" className="w-full mt-2 p-2 bg-black border border-gray-700"/>

            <button disabled={loading} onClick={pay} className="mt-4 bg-blue-600 w-full py-2 rounded hover:bg-blue-700 transition">
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </div>
        )}
      </section>

      <footer className="text-center text-gray-400 p-6 border-t border-gray-800">
        <p>© 2026 Akadev Store</p>
        <p>Email: storeakadev@gmail.com</p>
        <p>Phone: +6281266950382</p>
        <p>Address: Ujung Gading, Pasaman Barat, Sumatera Barat</p>
      </footer>

      {popup && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`px-4 py-3 rounded shadow-lg text-sm ${
            popup.type==="error" ? "bg-red-600" : "bg-green-600"
          }`}>
            {popup.message}
          </div>
        </div>
      )}

    </div>
  )
}