import { useNavigate, useLocation } from "react-router-dom"

export default function Pilih() {
  const nav = useNavigate()
  const { state } = useLocation()

  const harga = state?.price || 40000
  const produk = state?.name || "Server Panel"

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>
      <h3 style={{ fontSize: 16, marginBottom: 6 }}>Pilih Pembayaran</h3>
      <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>
        {produk}
      </p>

      <div style={{
        border: "1px solid #333",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        background: "#111"
      }}>
        <div style={{ fontSize: 12 }}>Total</div>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          Rp{harga.toLocaleString()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

        <button
          onClick={() => nav("/qr", { state })}
          style={{
            padding: 10,
            fontSize: 12,
            borderRadius: 6,
            background: "#2563eb",
            color: "#fff",
            border: "none"
          }}
        >
          QRIS (ShopeePay)
        </button>

        <button
          onClick={() => nav("/creditcard", { state })}
          style={{
            padding: 10,
            fontSize: 12,
            borderRadius: 6,
            background: "#16a34a",
            color: "#fff",
            border: "none"
          }}
        >
          Credit Card
        </button>

      </div>

      <p style={{ marginTop: 20, fontSize: 11, textAlign: "center" }}>
        payment gateway by{" "}
        <a href="https://duitku.com" target="_blank" style={{ color: "#1e40af" }}>
          Duitku
        </a>
      </p>
    </div>
  )
}