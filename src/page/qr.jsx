import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function QR() {
  const [qr, setQr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const [expiredAt, setExpiredAt] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  
  const navigate = useNavigate()
  const { state } = useLocation()
  const amount = state?.price || 40000
  const productName = state?.name || "Server Panel"

  useEffect(() => {
    let interval
    if (expiredAt) {
      interval = setInterval(() => {
        const now = new Date()
        const expired = new Date(expiredAt)
        const diff = expired - now
        
        if (diff <= 0) {
          setTimeLeft('Expired')
          clearInterval(interval)
          setError('QR Code telah kadaluarsa, silakan buat transaksi baru')
        } else {
          const minutes = Math.floor(diff / 60000)
          const seconds = Math.floor((diff % 60000) / 1000)
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [expiredAt])

  const load = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/qris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error || 'Failed to generate QR code')
      }

      setQr(json.data.qrString)
      setOrderId(json.data.orderId)
      setExpiredAt(json.data.expiredAt)
      
      // Simpan orderId ke localStorage untuk pengecekan status
      localStorage.setItem(`order_${json.data.orderId}`, JSON.stringify({
        orderId: json.data.orderId,
        amount: json.data.amount,
        product: productName,
        createdAt: new Date().toISOString()
      }))
      
      // Mulai polling untuk cek status pembayaran
      startPolling(json.data.orderId)
    } catch (e) {
      setError(e.message)
      console.error('QR Error:', e)
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (orderId) => {
    let attempts = 0
    const maxAttempts = 60 // 5 menit (cek setiap 5 detik)
    
    const pollInterval = setInterval(async () => {
      attempts++
      
      try {
        const res = await fetch(`/api/status?orderId=${orderId}`)
        const json = await res.json()
        
        if (json.success && json.data.status === 'SUCCESS') {
          clearInterval(pollInterval)
          navigate('/success', { 
            state: { 
              orderId: json.data.orderId,
              amount: json.data.amount,
              product: productName
            }
          })
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          setError('Waktu pembayaran habis, silakan buat transaksi baru')
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 5000)
    
    // Simpan interval ID untuk cleanup
    window.pollInterval = pollInterval
  }

  useEffect(() => {
    load()
    return () => {
      if (window.pollInterval) clearInterval(window.pollInterval)
    }
  }, [])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <p>Memproses pembayaran...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorMessage}>{error}</div>
          <button onClick={load} style={styles.retryButton}>
            Coba Lagi
          </button>
          <button onClick={() => navigate('/pilih', { state: { price: amount, name: productName } })} 
            style={styles.backButton}>
            Kembali ke Pilihan Pembayaran
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>QRIS Payment</h3>
        
        <div style={styles.productInfo}>
          <div>{productName}</div>
          <div style={styles.amount}>Rp {amount.toLocaleString()}</div>
        </div>
        
        {timeLeft && (
          <div style={styles.timer}>
            <span>⏱️ Waktu tersisa: </span>
            <span style={styles.timerValue}>{timeLeft}</span>
          </div>
        )}
        
        {qr && (
          <>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qr)}`}
              alt="QR Code"
              style={styles.qrImage}
            />
            <div style={styles.instruction}>
              Scan QR Code di atas menggunakan aplikasi pembayaran (ShopeePay, Dana, OVO, LinkAja, dll)
            </div>
            <div style={styles.orderId}>
              Order ID: <span style={styles.orderIdValue}>{orderId}</span>
            </div>
          </>
        )}
        
        <button onClick={() => navigate('/pilih', { state: { price: amount, name: productName } })} 
          style={styles.cancelButton}>
          Batal
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#0a0a0a',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: '#171717',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#e5e5e5'
  },
  productInfo: {
    background: '#0a0a0a',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#aaa'
  },
  amount: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: '6px'
  },
  timer: {
    background: '#0a0a0a',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#f59e0b'
  },
  timerValue: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  qrImage: {
    width: '250px',
    height: '250px',
    margin: '16px auto',
    background: 'white',
    padding: '10px',
    borderRadius: '12px'
  },
  instruction: {
    fontSize: '12px',
    color: '#888',
    marginTop: '12px',
    lineHeight: '1.5'
  },
  orderId: {
    fontSize: '11px',
    color: '#666',
    marginTop: '12px',
    wordBreak: 'break-all'
  },
  orderIdValue: {
    color: '#888',
    fontFamily: 'monospace'
  },
  cancelButton: {
    width: '100%',
    padding: '10px',
    marginTop: '16px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '12px'
  },
  retryButton: {
    width: '100%',
    padding: '10px',
    marginTop: '12px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px'
  },
  backButton: {
    width: '100%',
    padding: '10px',
    marginTop: '8px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '12px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #333',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  errorMessage: {
    color: '#ef4444',
    marginBottom: '20px',
    fontSize: '14px'
  }
}