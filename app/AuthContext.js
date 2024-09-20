// context/AuthContext.js
'use client'

import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check if token exists in cookies on initial load
    const savedToken = Cookies.get('jwt')
    if (savedToken) {
      const isTokenValid = checkTokenExpiry(savedToken)
      if (isTokenValid) {
        setToken(savedToken)
      } else {
        logout()
      }
    } else {
      logout()
    }
  }, [])

  const checkTokenExpiry = (token) => {
    try {
      const decodeToken = jwtDecode(token)
      const currentTime = new Date() / 1000 //Get current time in seconds

      if (decodeToken.exp < currentTime) {
        return false // Token is expired
      }
      return true // Token is still valid
    } catch (error) {
      console.error('Error decoding token:', error)
      return false // If decoding fails, consider the token invalid
    }
  }

  const loginSaveCookie = (jwt) => {
    const expiresDate = new Date()
    expiresDate.setHours(expiresDate.getHours() + 8) // Set expiry 8 hours from now

    Cookies.set('jwt', jwt, { expires: expiresDate })

    // Cookies.set("jwt", jwt, { expires: 7 }); // Expires in 7 days
    setToken(jwt)
  }

  const logout = () => {
    Cookies.remove('jwt')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, loginSaveCookie, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
