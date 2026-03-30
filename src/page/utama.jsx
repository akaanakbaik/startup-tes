import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Utama() {
  const navigate = useNavigate()

  const katalog = [
    {name:"Starter",ram:"1GB",price:5000,popular:false},
    {name:"Basic",ram:"2GB",price:9000,popular:false},
    {name:"Standard",ram:"3GB",price:13000,popular:true},
    {name:"Plus",ram:"4GB",price:17000,popular:false},
    {name:"Pro",ram:"6GB",price:20000,popular:true},
    {name:"Advanced",ram:"8GB",price:28000,popular:false},
    {name:"Ultra",ram:"10GB",price:35000,popular:false},
    {name:"Max",ram:"Unlimited",price:50000,popular:false},
    {name:"Bot",ram:"512MB",price:3000,popular:false},
    {name:"Lite",ram:"768MB",price:4000,popular:false},
    {name:"Game",ram:"12GB",price:60000,popular:false},
    {name:"Enterprise",ram:"Unlimited",price:100000,popular:false}
  ]

  function buy(p) {
    navigate('/pilih', { state: { price: p.price, name: p.name } })
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.logoSection}>
            <img 
              src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/file_000000000dec71faa172d7d8d6e29392.png" 
              style={styles.logo}
              alt="Akadev Store"
            />
            <div>
              <div style={styles.storeName}>Akadev Store</div>
              <div style={styles.storeTag}>Pterodactyl Panel Hosting</div>
            </div>
          </div>
        </div>

        <div style={styles.hero}>
          <div style={styles.heroTitle}>
            Layanan Hosting Panel Profesional
          </div>
          <div style={styles.heroSubtitle}>
            Server stabil untuk bot, aplikasi, dan game. Infrastruktur cepat dan aman dengan uptime 99.9%
          </div>
        </div>

        <div style={styles.grid}>
          {katalog.map((p,i)=>(
            <div key={i} style={styles.card}>
              {p.popular && (
                <div style={styles.popularBadge}>POPULER</div>
              )}
              <div style={styles.cardName}>{p.name}</div>
              <div style={styles.cardRam}>{p.ram} RAM</div>
              <div style={styles.cardPrice}>Rp {p.price.toLocaleString()}</div>
              <button 
                onClick={()=>buy(p)} 
                style={styles.buyButton}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                Checkout
              </button>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <div>📧 storeakadev@gmail.com</div>
            <div>📞 081266950382</div>
            <div>📍 Indonesia</div>
          </div>
          <div style={styles.copyright}>
            © 2024 Akadev Store. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#0a0a0a',
    minHeight: '100vh',
    color: '#e5e5e5'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    marginBottom: '30px'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  storeName: {
    fontWeight: 'bold',
    fontSize: '18px'
  },
  storeTag: {
    fontSize: '12px',
    color: '#888'
  },
  hero: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '14px',
    color: '#888',
    maxWidth: '600px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '40px'
  },
  card: {
    background: '#171717',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1px solid #222'
  },
  popularBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#f59e0b',
    color: '#000',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  cardName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  cardRam: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '12px'
  },
  cardPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '16px'
  },
  buyButton: {
    width: '100%',
    padding: '10px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  footer: {
    borderTop: '1px solid #222',
    paddingTop: '24px',
    textAlign: 'center'
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    fontSize: '12px',
    color: '#888',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  copyright: {
    fontSize: '11px',
    color: '#666'
  }
}