// pages/signup.js or app/signup/page.js
'use client'

import { useState, useContext } from 'react'
// import { AuthContext } from '../context/AuthContext'
// import { useRouter } from 'next/router' // For pages directory
import { AuthContext } from '../AuthContext'
// For app directory, use: import { useRouter } from 'next/navigation';
// import { useState, useContext } from 'react'
// import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const { loginSaveCookie } = useContext(AuthContext)
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // console.log(, process.env.BASE_URL)
    // fetch("http://localhost:5001/test-cors")
    //     .then(res => res.json())
    //     .then(console.log)
    //     .catch(console.error)
    //     .finally(console.log)
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_WEB_URL + 'auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to sign up')
      }

      const data = await res.json()
      console.log(data)

      loginSaveCookie(data.jwt) // Store the JWT
      router.push('/') // Redirect to home page
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
            />
          </div>
          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
            />
          </div>
          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
