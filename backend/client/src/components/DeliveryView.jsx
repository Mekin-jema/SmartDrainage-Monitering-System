import { useState, useEffect } from 'react'
import Map from './Map'
import useSocket from '../hooks/useSocket'

export default function DeliveryView({ user }) {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [orderId, setOrderId] = useState('order123') // In real app, get from API
  const socket = useSocket()

  // Get GPS location periodically
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
          
          if (socket && orderId) {
            socket.emit('update_location', {
              orderId,
              lat: latitude,
              lng: longitude
            })
          }
        },
        (error) => console.error('GPS Error:', error)
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [socket, orderId])

  return (
    <div className="delivery-view">
      <h2>Delivery Dashboard</h2>
      {currentLocation ? (
        <Map 
          center={currentLocation} 
          markerPosition={currentLocation}
          markerText="Your Location"
        />
      ) : (
        <p>Getting your location...</p>
      )}
    </div>
  )
}