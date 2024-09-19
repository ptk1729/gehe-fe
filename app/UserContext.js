'use client'

import { createContext, useState } from 'react'

export const UserContext = createContext()

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  const updateUser = (userData) => {
    setUser(userData)
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}
