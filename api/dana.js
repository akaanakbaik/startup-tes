import crypto from "crypto"
import { createTransaction } from "../src/lib/db.js"

export default async function handler(req, res) {
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
    const productName = body?.productName || "Server Panel"
    const customerEmail = body?.customerEmail || "storeakadev@gmail.com"
    const customerName = body?.customerName || "Akadev Store"

    if (amount < 1000 || amount > 10000000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be between Rp 1,000 and Rp 10,000,000' 
      })
    }

    const merchantCode = "DS29293"
    const apiKey = "290cbe6bcb208b191dd2e9f197f1ea68"
    const orderId = "INV" + Date.now() + Math.random().toString(36).substr(2, 6)

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + orderId + amount + apiKey)
      .digest("hex")

    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: "DA",
      merchantOrderId: orderId,
      productDetails: "Pembayaran DANA",
      email: customerEmail,
      customerVaName: "AKADEV STORE",
      itemDetails: [
        {
          name: productName,
          price: amount,
          quantity: 1
        }
      ],
      customerDetail: {
        firstName: customerName.split(' ')[0] || "Akadev",
        lastName: customerName.split(' ').slice(1).join(' ') || "Store",
        email: customerEmail,
        phoneNumber: "081266950382"
      },
      callbackUrl: "https://store.domku.xyz/api/callback",
      returnUrl: "https://store.domku.xyz/result",
      signature,
      expiryPeriod: 10
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

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
      const data = await r.json()

      if (!data.qrString && !data.paymentUrl) {
        return res.status(500).json({
          success: false,
          error: data.message || 'Failed to generate payment'
        })
      }

      await createTransaction({
        orderId,
        amount,
        productName,
        customerEmail,
        customerName,
        paymentMethod: "DANA",
        qrString: data.qrString,
        paymentUrl: data.paymentUrl
      })

      return res.status(200).json({
        success: true,
        data: {
          qrString: data.qrString,
          paymentUrl: data.paymentUrl,
          orderId,
          amount
        }
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ success: false, error: 'Request timeout' })
      }
      throw fetchError
    }
  } catch (err) {
    console.error('DANA API Error:', err)
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    })
  }
}