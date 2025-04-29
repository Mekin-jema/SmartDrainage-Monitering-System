import { useState, useEffect } from 'react'
import LoginForm from './pages/LoginForm'
import CustomerView from './components/CustomerView'
import DeliveryView from './components/DeliveryView'
import Home from './pages/Home.jsx'
import Register from './pages/Register'
import { verifyToken } from './services/auth'
import {Routes, Route} from 'react-router-dom'
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken(token).then(userData => {
        setUser(userData)
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="app">
      {
        <Routes>
      !user ? (
        <Route path='/' element={<Home />} />
         <Route path="/login" element={<LoginForm setUser={setUser} />} />
         <Route path="/register" element={<Register />} />
      ) : user.role === 'customer' ? (
        <Route path="/customer" element={<CustomerView user={user} />} />
      ) : (
        <Route path="/delivery" element={<DeliveryView user={user} />} />
      )
      </Routes>
      }
    </div>
  )
}

export default App