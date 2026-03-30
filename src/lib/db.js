import { createClient } from "@libsql/client"

const url = "libsql://store-akaanakbaik.aws-ap-northeast-1.turso.io"
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQ4ODUzMjcsImlkIjoiMDE5ZDNmNjgtNzMwMC03OGIzLTlhZTAtMDhmNTg1ZTVkNmU4IiwicmlkIjoiMzNmYjExZWQtNTFjMS00OTYyLWIyMWMtYzUxYWVkOTZmODk3In0.dsbUQX4AWOzSFOhnqRs9KnANTHCqft90mYFyvd5G6YpMVBMmV_3NEmrbTOHy2qiZx9lMqFE_ToT8XaPmGktUAg"

export const db = createClient({ url, authToken })

export async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      order_id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      customer_email TEXT,
      customer_name TEXT,
      payment_method TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      reference TEXT,
      qr_string TEXT,
      payment_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      additional_data TEXT
    )
  `)
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY DEFAULT 1,
      total_transactions INTEGER DEFAULT 0,
      success_transactions INTEGER DEFAULT 0,
      failed_transactions INTEGER DEFAULT 0,
      total_amount INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  const stats = await db.execute("SELECT * FROM stats WHERE id = 1")
  if (stats.rows.length === 0) {
    await db.execute(`
      INSERT INTO stats (id, total_transactions, success_transactions, failed_transactions, total_amount)
      VALUES (1, 0, 0, 0, 0)
    `)
  }
}

initDatabase().catch(console.error)

export async function createTransaction(data) {
  const { orderId, amount, productName, customerEmail, customerName, paymentMethod, qrString, paymentUrl } = data
  
  await db.execute({
    sql: `INSERT INTO transactions (order_id, amount, product_name, customer_email, customer_name, payment_method, qr_string, payment_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [orderId, amount, productName, customerEmail || null, customerName || null, paymentMethod, qrString || null, paymentUrl || null]
  })
  
  await db.execute({
    sql: `UPDATE stats SET total_transactions = total_transactions + 1, total_amount = total_amount + ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
    args: [amount]
  })
  
  return getTransaction(orderId)
}

export async function updateTransaction(orderId, status, reference, additionalData = {}) {
  const updatedAt = new Date().toISOString()
  
  await db.execute({
    sql: `UPDATE transactions SET status = ?, reference = ?, updated_at = ?, paid_at = CASE WHEN ? = 'SUCCESS' THEN CURRENT_TIMESTAMP ELSE paid_at END, additional_data = ? WHERE order_id = ?`,
    args: [status, reference, updatedAt, status, JSON.stringify(additionalData), orderId]
  })
  
  if (status === 'SUCCESS') {
    await db.execute({
      sql: `UPDATE stats SET success_transactions = success_transactions + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`
    })
  } else if (status === 'FAILED') {
    await db.execute({
      sql: `UPDATE stats SET failed_transactions = failed_transactions + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`
    })
  }
  
  return getTransaction(orderId)
}

export async function getTransaction(orderId) {
  const result = await db.execute({
    sql: `SELECT * FROM transactions WHERE order_id = ?`,
    args: [orderId]
  })
  
  if (result.rows.length === 0) return null
  
  const row = result.rows[0]
  return {
    orderId: row.order_id,
    amount: row.amount,
    productName: row.product_name,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    paymentMethod: row.payment_method,
    status: row.status,
    reference: row.reference,
    qrString: row.qr_string,
    paymentUrl: row.payment_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paidAt: row.paid_at,
    additionalData: row.additional_data ? JSON.parse(row.additional_data) : null
  }
}

export async function getAllTransactions(page = 1, limit = 10) {
  const offset = (page - 1) * limit
  const result = await db.execute({
    sql: `SELECT * FROM transactions ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [limit, offset]
  })
  
  const countResult = await db.execute(`SELECT COUNT(*) as total FROM transactions`)
  const total = countResult.rows[0].total
  
  return {
    data: result.rows.map(row => ({
      orderId: row.order_id,
      amount: row.amount,
      productName: row.product_name,
      status: row.status,
      createdAt: row.created_at
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export async function getStats() {
  const stats = await db.execute(`SELECT * FROM stats WHERE id = 1`)
  const pending = await db.execute(`SELECT COUNT(*) as pending FROM transactions WHERE status = 'PENDING'`)
  
  const row = stats.rows[0]
  return {
    totalTransactions: row.total_transactions,
    successTransactions: row.success_transactions,
    failedTransactions: row.failed_transactions,
    pendingTransactions: pending.rows[0].pending,
    totalAmount: row.total_amount,
    successRate: row.total_transactions > 0 ? ((row.success_transactions / row.total_transactions) * 100).toFixed(2) : 0
  }
}