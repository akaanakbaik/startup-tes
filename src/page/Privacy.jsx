import { useNavigate } from 'react-router-dom'

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Kembali ke Beranda
        </button>
        
        <div style={styles.card}>
          <h1 style={styles.title}>Kebijakan Privasi</h1>
          <p style={styles.lastUpdate}>Terakhir diperbarui: 2 April 2025</p>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Informasi yang Dikumpulkan</h2>
            <p style={styles.text}>
              Kami mengumpulkan informasi berikut saat Anda menggunakan layanan kami:
            </p>
            <ul style={styles.list}>
              <li>Nama dan alamat email</li>
              <li>Nomor telepon</li>
              <li>Data transaksi pembayaran (melalui gateway Duitku)</li>
              <li>Alamat IP dan data penggunaan server</li>
              <li>Informasi pesanan dan riwayat pembelian</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Penggunaan Informasi</h2>
            <p style={styles.text}>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul style={styles.list}>
              <li>Memproses transaksi pembayaran Anda</li>
              <li>Mengirimkan notifikasi terkait layanan (invoice, maintenance, pembaruan)</li>
              <li>Memberikan dukungan pelanggan</li>
              <li>Meningkatkan keamanan server dan mencegah penyalahgunaan</li>
              <li>Mematuhi kewajiban hukum dan peraturan yang berlaku</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Perlindungan Data</h2>
            <p style={styles.text}>
              Kami melindungi data Anda dengan langkah-langkah keamanan yang sesuai, termasuk enkripsi data dan akses terbatas. 
              Namun, tidak ada metode transmisi data melalui internet yang 100% aman, sehingga kami tidak dapat menjamin keamanan absolut.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Berbagi Data dengan Pihak Ketiga</h2>
            <p style={styles.text}>
              Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak luar, kecuali:
            </p>
            <ul style={styles.list}>
              <li>Penyedia layanan pembayaran (Duitku) untuk memproses transaksi</li>
              <li>Jika diwajibkan oleh hukum atau proses hukum yang berlaku</li>
              <li>Untuk melindungi hak, properti, atau keselamatan Akadev Store dan pengguna kami</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Cookie dan Teknologi Pelacakan</h2>
            <p style={styles.text}>
              Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna, menyimpan preferensi, dan menganalisis lalu lintas. 
              Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur website mungkin tidak berfungsi optimal.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Hak Pengguna</h2>
            <p style={styles.text}>Anda memiliki hak untuk:</p>
            <ul style={styles.list}>
              <li>Mengakses data pribadi yang kami simpan</li>
              <li>Meminta koreksi jika ada data yang tidak akurat</li>
              <li>Meminta penghapusan data (dengan batasan tertentu)</li>
              <li>Menarik persetujuan untuk pemrosesan data</li>
            </ul>
            <p style={styles.text}>
              Untuk menggunakan hak-hak tersebut, silakan hubungi kami di storeakadev@gmail.com.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>7. Retensi Data</h2>
            <p style={styles.text}>
              Kami menyimpan data transaksi dan riwayat pembelian selama diperlukan untuk keperluan perpajakan dan kepatuhan hukum, 
              minimal 5 tahun. Data lainnya akan dihapus setelah Anda tidak lagi menjadi pelanggan aktif, kecuali ada kewajiban hukum untuk menyimpannya.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>8. Privasi Anak-Anak</h2>
            <p style={styles.text}>
              Layanan kami tidak ditujukan untuk anak di bawah usia 13 tahun. Kami tidak secara sadar mengumpulkan data dari anak di bawah 13 tahun. 
              Jika Anda orang tua/wali dan mengetahui anak Anda memberikan data kepada kami, hubungi kami untuk menghapus data tersebut.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>9. Perubahan Kebijakan Privasi</h2>
            <p style={styles.text}>
              Akadev Store berhak mengubah kebijakan privasi ini sewaktu-waktu. Perubahan akan diumumkan melalui website dan berlaku efektif 
              setelah diumumkan. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>10. Kontak</h2>
            <p style={styles.text}>
              Jika ada pertanyaan mengenai kebijakan privasi ini, silakan hubungi:<br/>
              📧 Email: storeakadev@gmail.com<br/>
              📞 Telepon: 081266950382<br/>
              📍 Alamat: Indonesia
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