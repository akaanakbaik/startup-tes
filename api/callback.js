import crypto from "crypto"
import { updateTransaction, getTransaction } from "../src/lib/db.js"

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      merchantCode,
      amount,
      merchantOrderId,
      signature,
      resultCode,
      reference,
      paymentMethod
    } = req.body

    if (!merchantOrderId || !signature) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const apiKey = "290cbe6bcb208b191dd2e9f197f1ea68"

    const validSign = crypto
      .createHash("md5")
      .update(merchantCode + amount + merchantOrderId + apiKey)
      .digest("hex")

    if (signature !== validSign) {
      return res.status(400).json({ error: 'INVALID SIGNATURE' })
    }

    const status = resultCode === "00" ? "SUCCESS" : "FAILED"
    
    const transaction = await getTransaction(merchantOrderId)
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    await updateTransaction(merchantOrderId, status, reference, {
      paymentMethod,
      resultCode,
      callbackReceivedAt: new Date().toISOString()
    })

    if (status === "SUCCESS") {
      try {
        const discordWebhook = "https://discord.com/api/webhooks/your-webhook-url"
        await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `✅ Payment Success!\nOrder: ${merchantOrderId}\nAmount: Rp ${transaction.amount?.toLocaleString()}\nProduct: ${transaction.productName}`
          })
        })
      } catch (error) {
        console.error('Failed to send notification:', error)
      }
    }

    return res.status(200).json({ 
      status: 'OK', 
      message: 'Callback processed successfully',
      transactionId: merchantOrderId
    })
  } catch (error) {
    console.error('Callback error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}