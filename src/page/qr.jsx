import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function QR() {
  const { state } = useLocation()
  const [qr, setQr] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("MENUNGGU")

  const harga = state?.price || 40000

  const createQR = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/qris", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: harga
        })
      })

      const json = await res.json()

      if (!json.success) {
        alert("Gagal buat QR")
        return
      }

      setQr(json.data.qrString)
    } catch (err) {
      alert("Server error")
    }

    setLoading(false)
  }

  useEffect(() => {
    createQR()
  }, [])

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>
      <h3 style={{ fontSize: 16 }}>QRIS Payment</h3>

      <div style={{
        border: "1px solid #333",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        background: "#111"
      }}>
        <div style={{ fontSize: 12 }}>Total</div>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          Rp{harga.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: "#aaa" }}>
          Fee: Rp0
        </div>
      </div>

      <div style={{
        marginTop: 16,
        padding: 16,
        border: "1px solid #333",
        borderRadius: 8,
        textAlign: "center",
        background: "#000"
      }}>
        {loading ? (
          <p style={{ fontSize: 12 }}>Loading QR...</p>
        ) : qr ? (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qr}`}
            style={{ width: "100%" }}
          />
        ) : (
          <p style={{ fontSize: 12 }}>QR tidak tersedia</p>
        )}
      </div>

      <button
        style={{
          marginTop: 12,
          width: "100%",
          padding: 10,
          fontSize: 12,
          borderRadius: 6,
          background: "#2563eb",
          color: "#fff",
          border: "none"
        }}
        onClick={() => alert("Cek status coming soon")}
      >
        Cek Status
      </button>

      <p style={{ fontSize: 11, marginTop: 10 }}>
        Status: {status}
      </p>

      <p style={{ marginTop: 20, fontSize: 11, textAlign: "center" }}>
        payment gateway by{" "}
        <a href="https://duitku.com" target="_blank" style={{ color: "#1e40af" }}>
          Duitku
        </a>
      </p>
    </div>
  )
}