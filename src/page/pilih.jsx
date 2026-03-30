import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

export default function Pilih() {
  const nav = useNavigate()
  const { state } = useLocation()
  const [loading, setLoading] = useState(false)

  const harga = state?.price || 40000
  const produk = state?.name || "Server Panel"

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      description: 'Scan menggunakan aplikasi pembayaran (ShopeePay, Dana, OVO, LinkAja)',
      icon: '📱',
      route: '/qris',
      color: '#2563eb'
    },
    {
      id: 'creditcard',
      name: 'Kartu Kredit',
      description: 'Visa, Mastercard, JCB',
      icon: '💳',
      route: '/cc',
      color: '#16a34a'
    },
    {
      id: 'dana',
      name: 'DANA',
      description: 'E-Wallet DANA',
      icon: '💰',
      route: '/dana',
      color: '#0ea5e9'
    }
  ]

  const handlePayment = async (method) => {
    setLoading(true)
    
    const transactionData = {
      product: produk,
      amount: harga,
      method: method.id,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('pending_transaction', JSON.stringify(transactionData))
    
    nav(method.route, { state: { price: harga, name: produk } })
    
    setTimeout(() => setLoading(false), 500)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Memproses...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.title}>Pilih Metode Pembayaran</h3>
          <p style={styles.subtitle}>{produk}</p>
        </div>

        <div style={styles.totalCard}>
          <div style={styles.totalLabel}>Total Pembayaran</div>
          <div style={styles.totalAmount}>{formatPrice(harga)}</div>
        </div>

        <div style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handlePayment(method)}
              style={styles.methodButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = method.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#333'
              }}
            >
              <div style={styles.methodIcon}>{method.icon}</div>
              <div style={styles.methodInfo}>
                <div style={styles.methodName}>{method.name}</div>
                <div style={styles.methodDesc}>{method.description}</div>
              </div>
              <div style={styles.methodArrow}>→</div>
            </button>
          ))}
        </div>

        <div style={styles.footer}>
          <button 
            onClick={() => nav('/')} 
            style={styles.backButton}
          >
            ← Kembali ke Beranda
          </button>
          <p style={styles.footerText}>
            Payment gateway by{' '}
            <a 
              href="https://duitku.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.link}
            >
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
    padding: '24px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
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
  totalCard: {
    background: '#0a0a0a',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'center',
    border: '1px solid #222'
  },
  totalLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px'
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  methodsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  methodButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  },
  methodIcon: {
    fontSize: '28px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#171717',
    borderRadius: '12px'
  },
  methodInfo: {
    flex: 1
  },
  methodName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: '4px'
  },
  methodDesc: {
    fontSize: '11px',
    color: '#666'
  },
  methodArrow: {
    fontSize: '20px',
    color: '#666',
    transition: 'transform 0.2s'
  },
  footer: {
    textAlign: 'center'
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
  footerText: {
    fontSize: '11px',
    color: '#666'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
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
  loadingText: {
    fontSize: '13px',
    color: '#888',
    textAlign: 'center'
  }
}