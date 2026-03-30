import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"

const Utama = lazy(() => import("./page/utama"))
const Pilih = lazy(() => import("./page/pilih"))
const QR = lazy(() => import("./page/qr"))
const CC = lazy(() => import("./page/creditcard"))
const Dana = lazy(() => import("./page/ewalletdana"))
const Success = lazy(() => import("./page/succes"))
const Failed = lazy(() => import("./page/failed"))
const Invoice = lazy(() => import("./page/invoice"))

const LoadingScreen = () => (
  <div style={{
    background: '#0a0a0a',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e5e5e5'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #333',
      borderTopColor: '#2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
)

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Utama />} />
          <Route path="/pilih" element={<Pilih />} />
          <Route path="/qris" element={<QR />} />
          <Route path="/cc" element={<CC />} />
          <Route path="/dana" element={<Dana />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failed" element={<Failed />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}