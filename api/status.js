import { getTransaction } from "../src/lib/db.js"

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { orderId } = req.query

  if (!orderId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Order ID is required' 
    })
  }

  try {
    const transaction = await getTransaction(orderId)

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transaction not found' 
      })
    }

    const response = {
      success: true,
      data: {
        orderId: transaction.orderId,
        amount: transaction.amount,
        status: transaction.status,
        reference: transaction.reference || null,
        productName: transaction.productName,
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }
    }

    if (transaction.status === 'SUCCESS') {
      response.data.paidAt = transaction.paidAt
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Status API Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
}