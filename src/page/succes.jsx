import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Success() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [countdown, setCountdown] = useState(5)
  
  const orderId = state?.orderId
  const amount = state?.amount
  const product = state?.product

  useEffect(() => {
    if (orderId) {
      localStorage.removeItem(`order_${orderId}`)
      localStorage.removeItem('pending_transaction')
    }
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [orderId, navigate])

  const handleBackToHome = () => {
    navigate('/')
  }

  const handleViewInvoice = () => {
    if (orderId) {
      navigate(`/invoice/${orderId}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        
        <div style={styles.title}>Pembayaran Berhasil!</div>
        
        <div style={styles.message}>
          Terima kasih, transaksi kamu sudah selesai
        </div>
        
        {orderId && (
          <div style={styles.orderInfo}>
            <div>Order ID: {orderId}</div>
            {amount && <div>Total: Rp {amount.toLocaleString()}</div>}
            {product && <div>Produk: {product}</div>}
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleViewInvoice} 
            style={styles.invoiceButton}
          >
            Lihat Invoice
          </button>
          
          <button 
            onClick={handleBackToHome} 
            style={styles.homeButton}
          >
            Kembali ke Beranda
          </button>
        </div>
        
        <div style={styles.countdown}>
          Mengalihkan ke beranda dalam {countdown} detik...
        </div>
        
        <div style={styles.support}>
          Butuh bantuan? Hubungi kami di storeakadev@gmail.com
        </div>
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
    padding: '32px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  icon: {
    fontSize: '72px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: '12px'
  },
  message: {
    fontSize: '14px',
    color: '#aaa',
    marginBottom: '20px'
  },
  orderInfo: {
    background: '#0a0a0a',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#888',
    marginBottom: '24px',
    textAlign: 'left'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px'
  },
  invoiceButton: {
    flex: 1,
    padding: '12px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  homeButton: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#e5e5e5',
    cursor: 'pointer',
    fontSize: '14px'
  },
  countdown: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '16px'
  },
  support: {
    fontSize: '11px',
    color: '#666',
    marginTop: '16px'
  }
}