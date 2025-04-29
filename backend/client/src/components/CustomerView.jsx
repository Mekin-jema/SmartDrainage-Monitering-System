import { useState, useEffect } from 'react'
import Map from './Map'
import useSocket from '../hooks/useSocket'

export default function CustomerView({ user }) {
  const [deliveryLocation, setDeliveryLocation] = useState(null)
  const [orderId, setOrderId] = useState('order123') // In real app, get from API

  const socket = useSocket({
    location_updated: (location) => {
      setDeliveryLocation(location)
    }
  })

  useEffect(() => {
    if (socket && orderId) {
      socket.emit('join_order', orderId)
    }
  }, [socket, orderId])

  return (
    <div className="customer-view">
      <h2>Your Delivery</h2>
      {deliveryLocation ? (
        <Map 
          center={deliveryLocation.coords} 
          markerPosition={deliveryLocation.coords}
          markerText="Delivery Partner"
        />
      ) : (
        <p>Waiting for delivery partner to start...</p>
      )}
    </div>
  )
}