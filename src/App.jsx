import Router from "./router"
import { useEffect } from "react"

export default function App() {
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error)
    }

    const handleRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return <Router />
}