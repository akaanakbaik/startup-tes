import { useNavigate } from 'react-router-dom'

export default function Terms() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Kembali ke Beranda
        </button>
        
        <div style={styles.card}>
          <h1 style={styles.title}>Syarat & Ketentuan</h1>
          <p style={styles.lastUpdate}>Terakhir diperbarui: 2 April 2025</p>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Deskripsi Layanan</h2>
            <p style={styles.text}>
              Akadev Store menyediakan layanan hosting Pterodactyl Panel untuk game server, bot, dan aplikasi. 
              Layanan ini berupa penyewaan sumber daya server (RAM, CPU, dan storage) yang dikelola melalui panel Pterodactyl.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Kebijakan Penggunaan</h2>
            <p style={styles.text}>Pengguna DILARANG keras menggunakan layanan untuk:</p>
            <ul style={styles.list}>
              <li>Menjalankan kode ilegal, malware, virus, atau program berbahaya lainnya</li>
              <li>Melakukan serangan DDoS atau serangan siber lainnya</li>
              <li>Cryptocurrency mining atau kegiatan yang membebani server secara berlebihan</li>
              <li>Konten dewasa, perjudian, atau aktivitas ilegal lainnya</li>
              <li>Berbagi akses panel dengan pihak yang tidak berwenang</li>
            </ul>
            <p style={styles.text}>
              Pelanggaran terhadap kebijakan ini akan mengakibatkan penghentian layanan SEPAKAT tanpa pengembalian dana.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Pembayaran dan Pengembalian Dana</h2>
            <p style={styles.text}>
              Pembayaran dilakukan melalui metode yang tersedia (QRIS, Kartu Kredit, DANA). 
              Karena produk yang dijual adalah layanan digital (hosting), maka TIDAK ADA pengembalian dana (non-refundable) 
              setelah layanan diaktifkan, kecuali jika layanan gagal diaktifkan oleh pihak Akadev Store.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Jaminan Layanan</h2>
            <p style={styles.text}>
              Kami menjamin uptime server sebesar 99.9% dalam satu bulan. Jika target ini tidak tercapai, 
              kompensasi berupa tambahan masa aktif (pro-rata) akan diberikan. Maintenance terjadwal tidak termasuk dalam perhitungan uptime.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Hak dan Kewajiban Akadev Store</h2>
            <p style={styles.text}>
              Kami berhak melakukan maintenance server yang mungkin menyebabkan downtime. 
              Untuk maintenance terencana, kami akan memberikan notifikasi minimal 24 jam sebelumnya melalui email.
              Kami berhak menghentikan layanan SEPAKAT jika pengguna melanggar kebijakan penggunaan.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Hak dan Kewajiban Pengguna</h2>
            <p style={styles.text}>
              Pengguna wajib membayar tepat waktu sesuai periode yang dipilih. 
              Pengguna bertanggung jawab penuh atas data dan aktivitas di panel masing-masing.
              Pengguna wajib mengamankan akun panel dan tidak membagikan kredensial kepada pihak lain.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>7. Pembatalan dan Penghentian Layanan</h2>
            <p style={styles.text}>
              Pengguna dapat membatalkan layanan dengan mengirim email ke storeakadev@gmail.com minimal 1x24 jam sebelum masa aktif berakhir. 
              Tidak ada pengembalian dana untuk pembatalan di tengah periode.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>8. Perubahan Syarat & Ketentuan</h2>
            <p style={styles.text}>
              Akadev Store berhak mengubah syarat & ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui website dan berlaku efektif setelah diumumkan.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>9. Hukum yang Berlaku</h2>
            <p style={styles.text}>
              Perjanjian ini tunduk pada hukum Negara Kesatuan Republik Indonesia. Segala sengketa akan diselesaikan secara musyawarah atau melalui jalur hukum yang berlaku.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>10. Kontak</h2>
            <p style={styles.text}>
              Jika ada pertanyaan mengenai syarat & ketentuan ini, silakan hubungi:<br/>
              📧 Email: storeakadev@gmail.com<br/>
              📞 Telepon: 081266950382
            </p>
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  backButton: {
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e5e5e5',
    padding: '10px 20px',
    cursor: 'pointer',
    marginBottom: '30px',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  card: {
    background: '#171717',
    borderRadius: '16px',
    padding: '40px',
    border: '1px solid #222'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  lastUpdate: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222'
  },
  section: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '12px'
  },
  text: {
    fontSize: '14px',
    color: '#aaa',
    lineHeight: '1.6'
  },
  list: {
    margin: '12px 0 12px 30px',
    color: '#aaa',
    fontSize: '14px',
    lineHeight: '1.8'
  }
}