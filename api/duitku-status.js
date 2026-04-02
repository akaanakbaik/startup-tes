import crypto from "crypto"

export default async function handler(req, res) {
  try {
    const merchantCode = "DS29215"
    const apiKey = "290cbe6bcb208b191dd2e9f197f1ea68"

    const { merchantOrderId } = req.body

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + merchantOrderId + apiKey)
      .digest("hex")

    const duitkuRes = await fetch("https://sandbox.duitku.com/webapi/api/merchant/transactionStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantCode,
        merchantOrderId,
        signature
      })
    })

    const data = await duitkuRes.json()
    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}