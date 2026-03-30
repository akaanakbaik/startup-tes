import crypto from "crypto"

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    let body = req.body

    if (typeof body === "string") {
      try {
        body = JSON.parse(body)
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON body' })
      }
    }

    const amount = body?.amount || 40000

    // Validasi amount
    if (amount < 1000 || amount > 10000000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be between Rp 1,000 and Rp 10,000,000' 
      })
    }

    const merchantCode = "DS29215"
    const apiKey = "79fbf35e6a735c573fc56cfa8dc25be8"
    const orderId = "INV" + Date.now() + Math.random().toString(36).substr(2, 6)

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
      email: "storeakadev@gmail.com",
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
        email: "storeakadev@gmail.com",
        phoneNumber: "081266950382"
      },
      callbackUrl: "https://store.domku.xyz/api/callback",
      returnUrl: "https://store.domku.xyz/result",
      signature,
      expiryPeriod: 10
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 detik timeout

    try {
      const r = await fetch(
        "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        }
      )

      clearTimeout(timeoutId)

      const text = await r.text()

      let data
      try {
        data = JSON.parse(text)
      } catch {
        return res.status(500).json({
          success: false,
          error: 'Invalid response from payment gateway',
          raw: text
        })
      }

      if (!data.qrString) {
        return res.status(500).json({
          success: false,
          error: data.message || 'Failed to generate QR code',
          duitku: data
        })
      }

      return res.status(200).json({
        success: true,
        data: {
          qrString: data.qrString,
          orderId: orderId,
          amount: amount,
          expiredAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        },
        orderId
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ success: false, error: 'Request timeout' })
      }
      throw fetchError
    }
  } catch (err) {
    console.error('QRIS API Error:', err)
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    })
  }
}