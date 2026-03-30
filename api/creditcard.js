import crypto from "crypto"
import { createTransaction } from "../src/lib/db.js"

export default async function handler(req, res) {
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

    amount = parseInt(amount)
    if (isNaN(amount) || amount < 1000 || amount > 10000000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be between Rp 1,000 and Rp 10,000,000' 
      })
    }

    const merchantCode = "DS29215"
    const apiKey = "79fbf35e6a735c573fc56cfa8dc25be8"
    const orderId = "INV" + Date.now() + Math.random().toString(36).substr(2, 6)
    const customerVaName = customerName || "AKADEV STORE"
    const product = productName || "Server Panel"
    const email = customerEmail || "storeakadev@gmail.com"

    const signature = crypto
      .createHash("md5")
      .update(merchantCode + orderId + amount + apiKey)
      .digest("hex")

    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: "VC",
      merchantOrderId: orderId,
      productDetails: "Pembayaran Credit Card",
      email: email,
      customerVaName: customerVaName,
      itemDetails: [
        {
          name: product,
          price: amount,
          quantity: 1
        }
      ],
      customerDetail: {
        firstName: customerName?.split(' ')[0] || "Akadev",
        lastName: customerName?.split(' ').slice(1).join(' ') || "Store",
        email: email,
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
      callbackUrl: "https://store.domku.xyz/api/callback",
      returnUrl: "https://store.domku.xyz/result",
      signature,
      expiryPeriod: 30,
      additionalParam: {
        productName: product
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const duitkuResponse = await fetch(
        "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "User-Agent": "AkadevStore/1.0"
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }
      )

      clearTimeout(timeoutId)
      const data = await duitkuResponse.json()

      if (!data.paymentUrl) {
        throw new Error(data.message || 'Failed to create payment')
      }

      await createTransaction({
        orderId,
        amount,
        productName: product,
        customerEmail: email,
        customerName: customerVaName,
        paymentMethod: "CREDIT_CARD",
        paymentUrl: data.paymentUrl
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