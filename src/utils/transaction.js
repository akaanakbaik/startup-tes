// File: src/utils/transaction.js
// Sistem database sederhana dengan Redis support jika diperlukan

class TransactionDB {
  constructor() {
    // Gunakan global object untuk persistensi di development
    if (!global._transactionDB) {
      global._transactionDB = {
        transactions: {},
        stats: {
          totalTransactions: 0,
          successTransactions: 0,
          failedTransactions: 0,
          totalAmount: 0
        }
      }
    }
    this.db = global._transactionDB
  }

  // Create new transaction
  createTransaction(data) {
    const { orderId } = data
    
    if (this.db.transactions[orderId]) {
      return { error: "DUPLICATE", transaction: null }
    }

    const transaction = {
      ...data,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attempts: 0
    }

    this.db.transactions[orderId] = transaction
    this.db.stats.totalTransactions++
    this.db.stats.totalAmount += data.amount || 0

    return { error: null, transaction }
  }

  // Update transaction
  updateTransaction(orderId, status, reference, additionalData = {}) {
    const transaction = this.db.transactions[orderId]
    
    if (!transaction) return null

    const oldStatus = transaction.status
    transaction.status = status
    transaction.reference = reference
    transaction.updatedAt = new Date().toISOString()
    
    Object.assign(transaction, additionalData)

    // Update stats
    if (oldStatus !== status) {
      if (status === "SUCCESS") {
        this.db.stats.successTransactions++
      } else if (status === "FAILED") {
        this.db.stats.failedTransactions++
      }
    }

    if (status === "SUCCESS" && !transaction.paidAt) {
      transaction.paidAt = new Date().toISOString()
    }

    return transaction
  }

  // Get transaction by ID
  getTransaction(orderId) {
    return this.db.transactions[orderId] || null
  }

  // Get all transactions with pagination
  getAllTransactions(page = 1, limit = 10) {
    const transactions = Object.values(this.db.transactions)
    const start = (page - 1) * limit
    const end = start + limit
    
    return {
      data: transactions.slice(start, end),
      total: transactions.length,
      page,
      totalPages: Math.ceil(transactions.length / limit)
    }
  }

  // Get transactions by status
  getTransactionsByStatus(status) {
    return Object.values(this.db.transactions).filter(t => t.status === status)
  }

  // Get stats
  getStats() {
    return {
      ...this.db.stats,
      pendingTransactions: this.getTransactionsByStatus('PENDING').length,
      successRate: this.db.stats.totalTransactions > 0 
        ? (this.db.stats.successTransactions / this.db.stats.totalTransactions * 100).toFixed(2)
        : 0
    }
  }

  // Clean expired transactions
  cleanExpiredTransactions(maxAgeHours = 24) {
    const now = new Date()
    let cleaned = 0

    for (const [id, transaction] of Object.entries(this.db.transactions)) {
      const createdAt = new Date(transaction.createdAt)
      const ageHours = (now - createdAt) / (1000 * 60 * 60)
      
      if (ageHours > maxAgeHours) {
        delete this.db.transactions[id]
        cleaned++
      }
    }

    return cleaned
  }
}

// Singleton instance
const transactionDB = new TransactionDB()

// Auto clean expired transactions every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = transactionDB.cleanExpiredTransactions(24)
    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} expired transactions`)
    }
  }, 60 * 60 * 1000) // setiap 1 jam
}

// Export functions
export const createTransaction = (data) => {
  const result = transactionDB.createTransaction(data)
  if (result.error) throw new Error(result.error)
  return result.transaction
}

export const updateTransaction = (orderId, status, reference, additionalData = {}) => {
  return transactionDB.updateTransaction(orderId, status, reference, additionalData)
}

export const getTransaction = (orderId) => {
  return transactionDB.getTransaction(orderId)
}

export const getAllTransactions = (page, limit) => {
  return transactionDB.getAllTransactions(page, limit)
}

export const getStats = () => {
  return transactionDB.getStats()
}