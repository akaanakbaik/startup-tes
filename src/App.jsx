import Router from "./router"
import { useEffect } from "react"

export default function App() {
  // Tambahkan global styles dan error handling
  useEffect(() => {
    // Global error handler untuk unhandled promise rejections
    const handleError = (event) => {
      console.error('Global error:', event.error)
      // Bisa ditambahkan logging ke service monitoring jika diperlukan
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    })
    
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])
  
  return <Router />
}