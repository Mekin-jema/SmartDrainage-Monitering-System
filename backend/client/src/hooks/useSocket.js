import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export default function useSocket(eventHandlers = {}) {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Only setup listeners if eventHandlers is provided and valid
    if (eventHandlers && typeof eventHandlers === 'object') {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        if (typeof handler === 'function') {
          socketRef.current.on(event, handler)
        } else {
          console.warn(`Handler for event "${event}" is not a function`)
        }
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off() // Remove all listeners
        socketRef.current.disconnect()
      }
    }
  }, [eventHandlers]) // Add eventHandlers to dependency array

  return socketRef.current
}