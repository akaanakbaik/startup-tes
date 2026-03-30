import crypto from "crypto"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const merchantCode = "DS29215"
  const apiKey = "ISI_API_KEY_SANDBOX_KAMU"

  const { name, price, email } = req.body

  const merchantOrderId = "INV" + Date.now()
  const paymentAmount = price

  const signature = crypto
    .createHash("md5")
    .update(merchantCode + merchantOrderId + paymentAmount + apiKey)
    .digest("hex")

  const response = await fetch("https://sandbox.duitku.com/webapi/api/merchant/createInvoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      merchantCode,
      paymentAmount,
      merchantOrderId,
      productDetails: name,
      email,
      paymentMethod: "SP",
      callbackUrl: "https://store.domku.xyz/callback",
      returnUrl: "https://store.domku.xyz",
      signature
    })
  })

  const data = await response.json()

  res.status(200).json({
    paymentUrl: data.paymentUrl || data.reference
  })
}