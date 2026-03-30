import { BrowserRouter, Routes, Route } from "react-router-dom"
import Utama from "./page/utama"
import Pilih from "./page/pilih"
import QR from "./page/qr"
import CC from "./page/creditcard"
import Dana from "./page/ewalletdana"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Utama />} />
        <Route path="/pilih" element={<Pilih />} />
        <Route path="/qris" element={<QR />} />
        <Route path="/cc" element={<CC />} />
        <Route path="/dana" element={<Dana />} />
      </Routes>
    </BrowserRouter>
  )
}