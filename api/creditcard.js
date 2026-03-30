import crypto from "crypto"
import { createTransaction } from "../../src/utils/transaction.js"

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    let { amount, customerEmail, customerName, productName } = req.body

    // Validasi amount
    amount = parseInt(amount)
    if (isNaN(amount) || amount < 1000 || amount > 10000000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be between Rp 1,000 and Rp 10,000,000' 
      })
    }

    const merchantCode = process.env.DUITKU_MERCHANT_CODE || "DS29215"
    const apiKey = process.env.DUITKU_API_KEY || "79fbf35e6a735c573fc56cfa8dc25be8"
    const isProduction = process.env.NODE_ENV === 'production'
    const baseUrl = process.env.BASE_URL || "https://store.domku.xyz"

    const orderId = "INV" + Date.now() + Math.random().toString(36).substr(2, 6)
    const customerVaName = customerName || "AKADEV STORE"

    // Buat signature
    const signature = crypto
      .createHash("md5")
      .update(merchantCode + orderId + amount + apiKey)
      .digest("hex")

    // Payload untuk Duitku
    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: "VC",
      merchantOrderId: orderId,
      productDetails: productName || "Pembayaran Credit Card",
      email: customerEmail || "storeakadev@gmail.com",
      customerVaName,
      itemDetails: [
        {
          name: productName || "Server Panel",
          price: amount,
          quantity: 1
        }
      ],
      customerDetail: {
        firstName: customerName?.split(' ')[0] || "Akadev",
        lastName: customerName?.split(' ').slice(1).join(' ') || "Store",
        email: customerEmail || "storeakadev@gmail.com",
        phoneNumber: "081266950382",
        billingAddress: {
          firstName: customerName?.split(' ')[0] || "Akadev",
          lastName: customerName?.split(' ').slice(1).join(' ') || "Store",
          address: "Indonesia",
          city: "Padang",
          postalCode: "25100",
          phone: "081266950382",
          countryCode: "ID"
        },
        shippingAddress: {
          firstName: customerName?.split(' ')[0] || "Akadev",
          lastName: customerName?.split(' ').slice(1).join(' ') || "Store",
          address: "Indonesia",
          city: "Padang",
          postalCode: "25100",
          phone: "081266950382",
          countryCode: "ID"
        }
      },
      callbackUrl: `${baseUrl}/api/callback`,
      returnUrl: `${baseUrl}/result`,
      signature,
      expiryPeriod: 30,
      additionalParam: {
        productName: productName || "Server Panel"
      }
    }

    // Pilih endpoint berdasarkan environment
    const apiUrl = isProduction 
      ? "https://passport.duitku.com/webapi/api/merchant/v2/inquiry"
      : "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry"

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const duitkuResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "AkadevStore/1.0"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await duitkuResponse.json()

      if (!data.paymentUrl && !data.qrString) {
        throw new Error(data.message || 'Failed to create payment')
      }

      // Simpan transaksi ke database
      createTransaction({
        orderId,
        amount,
        productName: productName || "Server Panel",
        customerEmail: customerEmail || "storeakadev@gmail.com",
        customerName,
        paymentMethod: "CREDIT_CARD",
        paymentUrl: data.paymentUrl,
        createdAt: new Date().toISOString()
      })

      return res.status(200).json({
        success: true,
        data: {
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
    console.error('Credit Card API Error:', err)
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    })
  }
}