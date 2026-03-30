import { getTransaction } from "./transaction.js"

export default function handler(req, res) {
  const { orderId } = req.query

  const trx = getTransaction(orderId)

  if (!trx) {
    return res.status(404).json({ success: false })
  }

  res.json({
    success: true,
    data: trx
  })
}