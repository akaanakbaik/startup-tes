import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Invoice() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await fetch(`/api/status?orderId=${id}`)
      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error || 'Failed to load invoice')
      }

      setData(json.data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'SUCCESS':
        return '#16a34a'
      case 'FAILED':
        return '#dc2626'
      case 'PENDING':
        return '#f59e0b'
      default:
        return '#888'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'SUCCESS':
        return 'Berhasil'
      case 'FAILED':
        return 'Gagal'
      case 'PENDING':
        return 'Menunggu Pembayaran'
      default:
        return status || 'Unknown'
    }
  }

  const handleRetryPayment = () => {
    if (data?.productName && data?.amount) {
      navigate('/pilih', { 
        state: { 
          price: data.amount, 
          name: data.productName 
        }
      })
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <p>Memuat invoice...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorMessage}>
            {error || 'Invoice tidak ditemukan'}
          </div>
          <button onClick={() => navigate('/')} style={styles.homeButton}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>AKADEV STORE</div>
          <div style={styles.invoiceTitle}>INVOICE</div>
        </div>

        <div style={styles.content}>
          <div style={styles.row}>
            <div style={styles.label}>Order ID</div>
            <div style={styles.value}>{data.orderId}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Tanggal</div>
            <div style={styles.value}>{formatDate(data.createdAt)}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Status</div>
            <div style={{...styles.value, color: getStatusColor(data.status)}}>
              {getStatusText(data.status)}
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <div style={styles.label}>Produk</div>
            <div style={styles.value}>{data.productName || 'Server Panel'}</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Jumlah</div>
            <div style={styles.value}>1</div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Total</div>
            <div style={styles.valueAmount}>
              Rp {data.amount?.toLocaleString()}
            </div>
          </div>

          {data.paymentMethod && (
            <div style={styles.row}>
              <div style={styles.label}>Metode Pembayaran</div>
              <div style={styles.value}>{data.paymentMethod}</div>
            </div>
          )}

          {data.reference && (
            <div style={styles.row}>
              <div style={styles.label}>Referensi</div>
              <div style={styles.value}>{data.reference}</div>
            </div>
          )}

          {data.status === 'PENDING' && (
            <button onClick={handleRetryPayment} style={styles.payButton}>
              Lanjutkan Pembayaran
            </button>
          )}
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Payment gateway by{' '}
            <a href="https://duitku.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Duitku
            </a>
          </p>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            Kembali ke Beranda
          </button>
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
    maxWidth: '500px',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  header: {
    background: '#2563eb',
    padding: '20px',
    textAlign: 'center'
  },
  logo: {
    fontSize: '14px',
    color: '#fff',
    opacity: 0.8,
    marginBottom: '8px'
  },
  invoiceTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff'
  },
  content: {
    padding: '20px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #222'
  },
  label: {
    fontSize: '13px',
    color: '#888'
  },
  value: {
    fontSize: '13px',
    color: '#e5e5e5',
    fontWeight: '500'
  },
  valueAmount: {
    fontSize: '16px',
    color: '#2563eb',
    fontWeight: 'bold'
  },
  divider: {
    height: '1px',
    background: '#222',
    margin: '16px 0'
  },
  payButton: {
    width: '100%',
    padding: '12px',
    marginTop: '20px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #222',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '12px'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  },
  backButton: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#e5e5e5',
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
    fontSize: '14px',
    textAlign: 'center'
  },
  homeButton: {
    width: '100%',
    padding: '10px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px'
  }
}