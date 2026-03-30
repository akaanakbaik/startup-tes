import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Invoice() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  const load = async () => {
    const res = await fetch(`/api/status?orderId=${id}`)
    const json = await res.json()

    if (json.success) {
      setData(json.data)
    }
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 5000)
    return () => clearInterval(i)
  }, [])

  if (!data) {
    return <div style={{ padding: 20 }}>Loading...</div>
  }

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>
      <h3 style={{ fontSize: 16 }}>Invoice</h3>

      <div style={{
        border: "1px solid #333",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        background: "#111"
      }}>
        <div style={{ fontSize: 12 }}>Order ID</div>
        <div style={{ fontSize: 13 }}>{data.orderId}</div>

        <div style={{ fontSize: 12, marginTop: 8 }}>Status</div>
        <div style={{
          fontSize: 14,
          color: data.status === "SUCCESS" ? "#16a34a" :
                 data.status === "FAILED" ? "#dc2626" : "#f59e0b"
        }}>
          {data.status}
        </div>

        <div style={{ fontSize: 12, marginTop: 8 }}>Amount</div>
        <div style={{ fontSize: 14 }}>
          Rp{data.amount?.toLocaleString()}
        </div>

        <div style={{ fontSize: 12, marginTop: 8 }}>Reference</div>
        <div style={{ fontSize: 12 }}>
          {data.reference || "-"}
        </div>
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