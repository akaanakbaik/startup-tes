import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function Failed() {
  const navigate = useNavigate()
  const { state } = useLocation()
  
  const orderId = state?.orderId
  const amount = state?.amount
  const product = state?.product

  useEffect(() => {
    if (orderId) {
      localStorage.removeItem(`order_${orderId}`)
    }
    localStorage.removeItem('pending_transaction')
  }, [orderId])

  const handleRetry = () => {
    if (product && amount) {
      navigate('/pilih', { state: { price: amount, name: product } })
    } else {
      navigate('/')
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>❌</div>
        
        <div style={styles.title}>Pembayaran Gagal</div>
        
        <div style={styles.message}>
          Transaksi tidak berhasil, silakan coba lagi
        </div>
        
        {orderId && (
          <div style={styles.orderInfo}>
            <div>Order ID: {orderId}</div>
            {amount && <div>Total: Rp {amount.toLocaleString()}</div>}
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleRetry} 
            style={styles.retryButton}
          >
            Coba Lagi
          </button>
          
          <button 
            onClick={handleBackToHome} 
            style={styles.homeButton}
          >
            Kembali ke Beranda
          </button>
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
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ef4444',
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
    marginBottom: '24px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px'
  },
  retryButton: {
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
  support: {
    fontSize: '11px',
    color: '#666',
    marginTop: '16px'
  }
}