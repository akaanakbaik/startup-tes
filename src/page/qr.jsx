import { useEffect, useState } from "react"

export default function QR() {
  const [qr, setQr] = useState("")
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/qris", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: 40000 })
      })

      const text = await res.text()
      console.log("RAW:", text)

      let json
      try {
        json = JSON.parse(text)
      } catch {
        alert("API ERROR:\n" + text)
        setLoading(false)
        return
      }

      if (!json.success) {
        alert("FAIL:\n" + JSON.stringify(json))
        setLoading(false)
        return
      }

      setQr(json.data.qrString)
    } catch (e) {
      alert("FETCH ERROR")
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h3>QRIS</h3>

      {loading && <p>Loading...</p>}

      {qr && (
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qr}`}
        />
      )}
    </div>
  )
}