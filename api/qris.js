import crypto from "crypto"

export default async function handler(req, res) {
  try {
    let body = req.body

    if (typeof body === "string") {
      body = JSON.parse(body)
    }

    const amount = body?.amount || 40000

    const merchantCode = "DS29215"
    const apiKey = "79fbf35e6a735c573fc56cfa8dc25be8"

    const orderId = "INV" + Date.now()

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + orderId + amount + apiKey)
      .digest("hex")

    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: "SP",
      merchantOrderId: orderId,
      productDetails: "Pembayaran QRIS",
      email: "test@test.com",
      customerVaName: "AKADEV STORE",
      itemDetails: [
        {
          name: "Server Panel",
          price: amount,
          quantity: 1
        }
      ],
      customerDetail: {
        firstName: "Akadev",
        lastName: "Store",
        email: "test@test.com",
        phoneNumber: "08123456789"
      },
      callbackUrl: "https://store.domku.xyz/api/callback",
      returnUrl: "https://store.domku.xyz/result",
      signature,
      expiryPeriod: 10
    }

    const r = await fetch(
      "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    const text = await r.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return res.status(500).json({
        success: false,
        raw: text
      })
    }

    if (!data.qrString) {
      return res.status(500).json({
        success: false,
        duitku: data
      })
    }

    return res.status(200).json({
      success: true,
      data,
      orderId
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}