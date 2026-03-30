import { useState, useEffect } from "react"

const products = [
  { name: "Starter", price: 10000, ram: "1GB", cpu: "40%", disk: "2GB" },
  { name: "Basic", price: 15000, ram: "2GB", cpu: "60%", disk: "4GB" },
  { name: "Standard", price: 20000, ram: "3GB", cpu: "80%", disk: "5GB" },
  { name: "Plus", price: 25000, ram: "4GB", cpu: "100%", disk: "8GB" },
  { name: "Pro", price: 30000, ram: "6GB", cpu: "120%", disk: "12GB" },
  { name: "Advanced", price: 40000, ram: "8GB", cpu: "150%", disk: "15GB" }
]

function App() {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState("catalog")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [qr, setQr] = useState("")
  const [status, setStatus] = useState("Menunggu pembayaran")
  const [notif, setNotif] = useState("")
  const [orderId, setOrderId] = useState("")

  const handleBuy = (item) => {
    setSelected(item)
    setStep("checkout")
  }

  const createPayment = async () => {
    if (!email) {
      setNotif("Email wajib diisi")
      return
    }

    setLoading(true)
    setNotif("Memproses transaksi...")

    try {
      const res = await fetch("/api/duitku-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: selected.name,
          price: selected.price,
          email
        })
      })

      const data = await res.json()

      if (!data.success) {
        setNotif(data.message || "Gagal membuat transaksi")
        setLoading(false)
        return
      }

      setQr(data.qrString)
      setOrderId(data.merchantOrderId)
      setStep("payment")
      setNotif("QR berhasil dibuat")
    } catch (e) {
      setNotif("Terjadi kesalahan server")
    }

    setLoading(false)
  }

  useEffect(() => {
    if (step === "payment" && orderId) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch("/api/duitku-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ merchantOrderId: orderId })
          })

          const data = await res.json()

          if (data.statusCode === "00") {
            setStatus("Pembayaran berhasil")
            setNotif("Transaksi berhasil diverifikasi")
            clearInterval(interval)
          }
        } catch {}
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [step, orderId])

  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      <header className="border-b border-neutral-800 p-4 flex justify-between">
        <div className="font-bold">Akadev Store</div>
        <div className="text-sm text-neutral-400">Sandbox Mode</div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">

        {notif && (
          <div className="mb-4 p-3 rounded bg-blue-600 text-sm">
            {notif}
          </div>
        )}

        {step === "catalog" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Pilih Paket</h1>

            <div className="grid md:grid-cols-3 gap-4">
              {products.map((p, i) => (
                <div key={i} className="border border-neutral-800 rounded-xl p-4 hover:border-blue-500 transition">

                  <div className="text-lg font-bold">{p.name}</div>
                  <div className="text-neutral-400 text-sm mb-3">
                    RAM {p.ram} • CPU {p.cpu} • Disk {p.disk}
                  </div>

                  <div className="text-xl font-bold mb-4">
                    Rp {p.price.toLocaleString()}
                  </div>

                  <button
                    onClick={() => handleBuy(p)}
                    className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
                  >
                    Beli
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "checkout" && selected && (
          <div className="max-w-lg mx-auto">

            <h2 className="text-xl font-bold mb-4">Checkout</h2>

            <div className="border border-neutral-800 p-4 rounded mb-4">
              <div>{selected.name}</div>
              <div className="text-sm text-neutral-400">
                Rp {selected.price.toLocaleString()}
              </div>
            </div>

            <input
              type="email"
              placeholder="Email kamu"
              className="w-full p-3 rounded bg-neutral-900 border border-neutral-700 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={createPayment}
              disabled={loading}
              className="w-full bg-green-600 py-3 rounded hover:bg-green-700"
            >
              {loading ? "Memproses..." : "Lanjut Pembayaran"}
            </button>

            <button
              onClick={() => setStep("catalog")}
              className="w-full mt-2 border border-neutral-700 py-2 rounded"
            >
              Kembali
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="max-w-md mx-auto text-center">

            <h2 className="text-xl font-bold mb-4">Pembayaran QRIS</h2>

            <div className="bg-yellow-500 text-black p-3 rounded mb-4 text-sm">
              Mode uji coba. Jangan lakukan pembayaran asli.
            </div>

            {qr && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=250x250`}
                alt="QR"
                className="mx-auto mb-4"
              />
            )}

            <div className="text-sm text-neutral-400 mb-2">
              Scan menggunakan aplikasi e-wallet
            </div>

            <div className="text-green-400 mb-4">{status}</div>

            <button
              onClick={() => {
                setStep("catalog")
                setQr("")
                setStatus("Menunggu pembayaran")
              }}
              className="w-full border border-neutral-700 py-2 rounded"
            >
              Kembali ke Katalog
            </button>
          </div>
        )}

      </main>

      <footer className="text-center text-xs text-neutral-500 p-4 border-t border-neutral-800">
        support@akadev.xyz • 081266950382 • Indonesia
      </footer>

    </div>
  )
}

export default App