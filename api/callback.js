import crypto from "crypto"
import { updateTransaction, getTransaction } from "../../src/utils/transaction.js"

export default async function handler(req, res) {
  // CORS headers
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
      paymentMethod,
      paymentStatus
    } = req.body

    // Validasi input
    if (!merchantOrderId || !signature) {
      console.error('Missing required fields:', { merchantOrderId, signature })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const apiKey = process.env.DUITKU_API_KEY || "79fbf35e6a735c573fc56cfa8dc25be8"

    // Validasi signature
    const validSign = crypto
      .createHash("md5")
      .update(merchantCode + amount + merchantOrderId + apiKey)
      .digest("hex")

    if (signature !== validSign) {
      console.error('Invalid signature for order:', merchantOrderId)
      return res.status(400).json({ error: 'INVALID SIGNATURE' })
    }

    // Tentukan status pembayaran
    const status = resultCode === "00" ? "SUCCESS" : "FAILED"
    const paymentStatusText = paymentStatus === "SUCCESS" ? "Berhasil" : "Gagal"

    // Update transaksi di database
    const updatedTransaction = updateTransaction(merchantOrderId, status, reference, {
      paymentMethod,
      resultCode,
      paymentStatus: paymentStatusText,
      updatedAt: new Date().toISOString()
    })

    if (!updatedTransaction) {
      console.error('Transaction not found:', merchantOrderId)
      return res.status(404).json({ error: 'Transaction not found' })
    }

    // Log untuk monitoring
    console.log(`Callback processed: Order ${merchantOrderId} - Status: ${status}`)

    // Kirim notifikasi jika diperlukan (email, webhook, dll)
    if (status === "SUCCESS") {
      await sendSuccessNotification(updatedTransaction)
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

// Fungsi untuk mengirim notifikasi (bisa dikembangkan)
async function sendSuccessNotification(transaction) {
  try {
    // Di sini bisa ditambahkan:
    // - Kirim email ke customer
    // - Kirim webhook ke external service
    // - Update database lain
    // - Log ke monitoring service
    
    console.log(`[NOTIFICATION] Payment success for order ${transaction.orderId}`)
    
    // Contoh: kirim ke Discord webhook
    if (process.env.DISCORD_WEBHOOK) {
      await fetch(process.env.DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `✅ Payment Success!\nOrder: ${transaction.orderId}\nAmount: Rp ${transaction.amount?.toLocaleString()}\nProduct: ${transaction.productName}`
        })
      })
    }
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}