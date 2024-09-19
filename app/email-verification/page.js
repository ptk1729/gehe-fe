'use client'

import { UserContext } from '../UserContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AuthContext'

export default function Verification() {
  const webURL = process.env.NEXT_PUBLIC_WEB_URL
  // const [user, setUser] = useState('')
  const [otp, setOtp] = useState('')
  const { user } = useContext(UserContext)
  const { loginSaveCookie } = useContext(AuthContext)

  // useEffect(() => {
  //   const { user } = userData
  //   console.log(user)
  //   setUser(user)
  // }, [])

  const router = useRouter()

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(webURL + 'auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...user,
          otp: otp,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to sign up')
      }

      const { token } = await res.json()
      loginSaveCookie(token)
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {' '}
          Please check your email
        </h2>
        <form onSubmit={handleVerifyOtp}>
          {/* OTP Verification */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              We've sent a code to
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  )
}
