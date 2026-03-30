import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function CreditCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { state } = useLocation()
  
  const amount = state?.price || 40000
  const productName = state?.name || "Server Panel"

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/creditcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          amount,
          productName,
          customerEmail: 'storeakadev@gmail.com',
          customerName: 'Akadev Store'
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to process payment')
      }

      // Redirect ke halaman pembayaran Duitku
      if (data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl
      } else {
        throw new Error('No payment URL received')
      }

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>💳</div>
          <h3 style={styles.title}>Credit Card Payment</h3>
          <p style={styles.subtitle}>Visa, Mastercard, JCB</p>
        </div>

        <div style={styles.productInfo}>
          <div style={styles.productName}>{productName}</div>
          <div style={styles.amount}>{formatPrice(amount)}</div>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            ...styles.payButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <div style={styles.loadingWrapper}>
              <div style={styles.loadingSpinner}></div>
              <span>Memproses...</span>
            </div>
          ) : (
            `Bayar ${formatPrice(amount)}`
          )}
        </button>

        <div style={styles.securityNote}>
          <span>🔒</span>
          <span style={styles.securityText}>
            Transaksi aman dengan enkripsi SSL. Data kartu kredit Anda dilindungi.
          </span>
        </div>

        <button 
          onClick={() => navigate('/pilih', { state: { price: amount, name: productName } })} 
          style={styles.backButton}
        >
          ← Kembali ke Pilihan Pembayaran
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Payment gateway by{' '}
            <a href="https://duitku.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Duitku
            </a>
          </p>
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
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e5e5e5',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '13px',
    color: '#888'
  },
  productInfo: {
    background: '#0a0a0a',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'center',
    border: '1px solid #222'
  },
  productName: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '8px'
  },
  amount: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  payButton: {
    width: '100%',
    padding: '14px',
    background: '#16a34a',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '16px',
    transition: 'all 0.2s'
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#0a0a0a',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '11px',
    color: '#888'
  },
  securityText: {
    flex: 1,
    lineHeight: '1.4'
  },
  backButton: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
    marginBottom: '16px',
    transition: 'all 0.2s'
  },
  errorMessage: {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid #dc2626',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#ef4444',
    textAlign: 'center'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    fontSize: '11px',
    color: '#666'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  }
}