'use client'

import Cookies from 'js-cookie'
import { useRef, useState } from 'react'
import { FcCamera } from 'react-icons/fc'
import Image from 'next/image'

export default function ProfilePage() {
  const webURL = process.env.NEXT_PUBLIC_WEB_URL
  const imgRef = useRef(null)
  const [form, setForm] = useState({
    image: '',
    firstName: '',
    lastName: '',
    email: '',
  })
  const [previewFile, setPreviewFile] = useState('')
  const [token, setToken] = useState(Cookies.get('jwt'))
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const getUserDetails = async () => {
    try {
      const response = await fetch(webURL + 'auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      console.log(data)
      setUserData(data)
      setForm({
        image: '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  if (token && !userData) {
    getUserDetails()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreviewFile(imageUrl)
      setForm((prevForm) => ({
        ...prevForm,
        image: imageUrl,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const response = await fetch(webURL + 'auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUserData(updatedUser)

      setMessage(updatedUser.message)

      //  update form with the new user data
      setForm((prevForm) => ({
        ...prevForm,
        firstName: updatedUser.firstName || prevForm.firstName,
        lastName: updatedUser.lastName || prevForm.lastName,
        email: updatedUser.email || prevForm.email,
      }))

      setLoading(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <section className="flex flex-col items-center min-h-screen bg-[#f4f4f5] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative h-24 w-24 mb-3">
            <Image
              className="h-24 w-24 object-cover border border-gray-300 rounded-full"
              width={24}
              height={24}
              src={previewFile}
            />
            <FcCamera
              className="absolute bottom-0 right-0 cursor-pointer text-3xl bg-white p-1 rounded-full border border-gray-300"
              onClick={() => imgRef.current.click()} // Trigger file input on click
            />
            <input
              type="file"
              ref={imgRef}
              onChange={handleFileChange}
              hidden
            />
          </div>
        </div>
        <div className="w-full mb-4">
          <label
            htmlFor="firstName"
            className="block mb-2 text-sm text-gray-600"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
        </div>
        <div className="w-full mb-4">
          <label
            htmlFor="lastName"
            className="block mb-2 text-sm text-gray-600"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </div>
        <div className="w-full mb-6">
          <label htmlFor="email" className="block mb-2 text-sm text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition duration-300"
        >
          {loading ? 'Submiting...' : 'Submit'}
        </button>
      </form>
    </section>
  )
}
