import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function QR() {
  const { state } = useLocation()
  const nav = useNavigate()

  const harga = state?.price || 40000
  const produk = state?.name || "Server Panel"

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("MENUNGGU")
  const [time, setTime] = useState(600)

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

      if (!json.success || !json.data?.qrString) {
        alert("Gagal membuat QR")
        setLoading(false)
        return
      }

      setData(json)
    } catch (err) {
      alert("Server error")
    }

    setLoading(false)
  }

  useEffect(() => {
    createQR()
  }, [])

  useEffect(() => {
    if (!data) return

    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setStatus("EXPIRED")
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [data])

  const checkStatus = async () => {
    setStatus("MENGECEK...")

    try {
      const res = await fetch(`/api/status?orderId=${data.orderId}`)
      const json = await res.json()

      if (json.success) {
        setStatus(json.data.status)

        if (json.data.status === "SUCCESS") {
          nav("/result", {
            state: {
              status: "SUCCESS"
            }
          })
        }
      } else {
        setStatus("MENUNGGU")
      }
    } catch {
      setStatus("ERROR")
    }
  }

  return (
    <div style={{ padding: 14, maxWidth: 420, margin: "auto" }}>
      <h3 style={{ fontSize: 15, marginBottom: 6 }}>
        QRIS Payment
      </h3>

      <p style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>
        {produk}
      </p>

      <div style={{
        border: "1px solid #333",
        borderRadius: 8,
        padding: 10,
        background: "#111"
      }}>
        <div style={{ fontSize: 11 }}>Total</div>
        <div style={{ fontSize: 17, fontWeight: "bold" }}>
          Rp{harga.toLocaleString()}
        </div>

        <div style={{ fontSize: 11, color: "#aaa" }}>
          Fee: Rp0
        </div>
      </div>

      <div style={{
        marginTop: 12,
        border: "1px solid #333",
        borderRadius: 8,
        padding: 12,
        textAlign: "center",
        background: "#000"
      }}>
        {loading ? (
          <p style={{ fontSize: 11 }}>Membuat QR...</p>
        ) : data?.data?.qrString ? (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data.data.qrString}`}
            style={{ width: "100%", maxWidth: 220 }}
          />
        ) : (
          <p style={{ fontSize: 11 }}>QR tidak tersedia</p>
        )}
      </div>

      <div style={{
        marginTop: 10,
        fontSize: 11,
        textAlign: "center"
      }}>
        Status:{" "}
        <span style={{
          color:
            status === "SUCCESS" ? "#16a34a" :
            status === "FAILED" ? "#dc2626" :
            status === "EXPIRED" ? "#f59e0b" :
            "#aaa"
        }}>
          {status}
        </span>
      </div>

      <div style={{
        marginTop: 6,
        fontSize: 11,
        textAlign: "center",
        color: "#aaa"
      }}>
        Expired: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
      </div>

      <button
        onClick={checkStatus}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 9,
          fontSize: 11,
          borderRadius: 6,
          background: "#2563eb",
          color: "#fff",
          border: "none"
        }}
      >
        Cek Status
      </button>

      <button
        onClick={createQR}
        style={{
          marginTop: 6,
          width: "100%",
          padding: 9,
          fontSize: 11,
          borderRadius: 6,
          background: "#333",
          color: "#fff",
          border: "none"
        }}
      >
        Refresh QR
      </button>

      <p style={{
        marginTop: 16,
        fontSize: 10,
        textAlign: "center"
      }}>
        payment gateway by{" "}
        <a
          href="https://duitku.com"
          target="_blank"
          style={{ color: "#1e40af" }}
        >
          Duitku
        </a>
      </p>
    </div>
  )
}