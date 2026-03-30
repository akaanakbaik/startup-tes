import { useState } from "react"

export default function CreditCard() {
  const [loading, setLoading] = useState(false)

  const pay = async () => {
    setLoading(true)

    const res = await fetch("/api/creditcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 40000
      })
    })

    const json = await res.json()

    setLoading(false)

    if (!json.success) {
      alert("Gagal membuat pembayaran")
      return
    }

    if (!json.data.paymentUrl) {
      alert("Payment URL kosong")
      return
    }

    window.location.href = json.data.paymentUrl
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Credit Card</h2>
      <p>Total: Rp40.000</p>

      <button onClick={pay} disabled={loading}>
        {loading ? "Loading..." : "Bayar Sekarang"}
      </button>

      <p style={{ marginTop: 20, fontSize: 12 }}>
        payment gateway by{" "}
        <a href="https://duitku.com" target="_blank">
          Duitku
        </a>
      </p>
    </div>
  )
}