import { useEffect, useState } from "react"

export default function App() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("Menunggu pembayaran")
  const [error, setError] = useState(null)

  async function createPayment() {
    try {
      setLoading(true)

      const res = await fetch("/api/duitku-create", {
        method: "POST"
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.message || "Gagal membuat transaksi")
      }

      setData(json.data)
      setStatus("Menunggu pembayaran")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function checkStatus() {
    if (!data) return

    try {
      const res = await fetch("/api/duitku-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantOrderId: data.merchantOrderId || ""
        })
      })

      const json = await res.json()

      if (json.statusCode === "00") {
        setStatus("Pembayaran berhasil")
      } else if (json.statusCode === "01") {
        setStatus("Menunggu pembayaran")
      } else {
        setStatus("Dibatalkan / gagal")
      }

    } catch (err) {}
  }

  useEffect(() => {
    createPayment()
  }, [])

  useEffect(() => {
    if (!data) return

    const interval = setInterval(() => {
      checkStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [data])

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <div style={styles.loader}></div>
          <div style={styles.text}>Memproses transaksi...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <div style={styles.error}>Terjadi kesalahan</div>
          <div style={styles.textSmall}>{error}</div>
          <button style={styles.button} onClick={createPayment}>
            Coba lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <div>Akadev Store</div>
          <div style={styles.badge}>Sandbox</div>
        </div>

        <div style={styles.notice}>
          Ini adalah mode uji coba. Jangan lakukan pembayaran nyata.
        </div>

        <div style={styles.section}>
          <div style={styles.title}>Pembayaran QRIS</div>
          <div style={styles.sub}>
            Scan QR menggunakan e-wallet apa pun
          </div>
        </div>

        {data?.qrImage ? (
          <img src={data.qrImage} style={styles.qr} />
        ) : (
          <div style={styles.error}>QR tidak tersedia</div>
        )}

        <div style={styles.section}>
          <div style={styles.label}>Status Transaksi</div>
          <div style={{
            ...styles.status,
            color:
              status === "Pembayaran berhasil"
                ? "#22c55e"
                : status === "Menunggu pembayaran"
                ? "#eab308"
                : "#ef4444"
          }}>
            {status}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.small}>
            Total: Rp {data?.amount || 0}
          </div>
        </div>

        <button style={styles.button} onClick={createPayment}>
          Buat Ulang Transaksi
        </button>

        <div style={styles.footer}>
          support@akadev.xyz • Indonesia
        </div>

      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    background: "#0a0a0a",
    minHeight: "100vh",
    padding: "10px"
  },
  container: {
    maxWidth: "420px",
    margin: "auto",
    color: "#fff",
    fontFamily: "sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "10px"
  },
  badge: {
    color: "#facc15",
    fontSize: "12px"
  },
  notice: {
    background: "#facc15",
    color: "#000",
    padding: "8px",
    fontSize: "12px",
    borderRadius: "6px",
    marginBottom: "12px"
  },
  section: {
    marginBottom: "10px"
  },
  title: {
    fontSize: "15px",
    fontWeight: "bold"
  },
  sub: {
    fontSize: "12px",
    color: "#aaa"
  },
  qr: {
    width: "220px",
    display: "block",
    margin: "10px auto",
    background: "#fff",
    padding: "10px",
    borderRadius: "10px"
  },
  label: {
    fontSize: "12px",
    color: "#aaa"
  },
  status: {
    fontSize: "14px",
    fontWeight: "bold"
  },
  small: {
    fontSize: "12px",
    color: "#aaa"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#111",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer"
  },
  footer: {
    textAlign: "center",
    fontSize: "11px",
    color: "#555",
    marginTop: "15px"
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#0a0a0a"
  },
  card: {
    textAlign: "center",
    color: "#fff"
  },
  loader: {
    width: "30px",
    height: "30px",
    border: "3px solid #333",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "auto"
  },
  text: {
    marginTop: "10px",
    fontSize: "13px"
  },
  textSmall: {
    fontSize: "12px",
    color: "#aaa"
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    textAlign: "center"
  }
}