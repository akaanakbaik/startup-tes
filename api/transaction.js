let db = global.db || (global.db = {})

export function createTransaction(data) {
  if (db[data.orderId]) {
    return { error: "DUPLICATE" }
  }

  db[data.orderId] = {
    ...data,
    status: "PENDING",
    createdAt: Date.now()
  }

  return db[data.orderId]
}

export function updateTransaction(orderId, status, reference) {
  if (!db[orderId]) return null

  db[orderId].status = status
  db[orderId].reference = reference

  return db[orderId]
}

export function getTransaction(orderId) {
  return db[orderId] || null
}

setInterval(() => {
  const now = Date.now()
  for (const id in db) {
    if (now - db[id].createdAt > 3600000) {
      delete db[id]
    }
  }
}, 60000)