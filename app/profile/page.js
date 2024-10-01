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

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]

  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file)
  //     setPreviewFile(imageUrl)
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       image: imageUrl,
  //     }))
  //   }
  // }

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

  const handleDelete = async () => {
    try {
      await fetch(webURL + 'auth/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {}
  }

  return (
    <section className="container space-y-5 min-h-screen p-2">
      {/* <form
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
      </form> */}

      <form
        className="flex flex-col space-y-5 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:px-10 sm:pt-10"
        onSubmit={handleSubmit}
      >
        {/* <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col space-y-3 p-5 sm:p-10">
            <h2 className="text-xl font-medium">Your Avatar</h2>
            <p className="text-sm text-gray-500">
              This is your avatar image on{' '}
            </p>
            <div className="mt-1">
              <label className="group relative isolate flex aspect-[1200/630] flex-col items-center justify-center overflow-hidden bg-white transition-all hover:bg-gray-50 cursor-pointer h-24 w-24 rounded-full border border-gray-300">
                <div className="absolute inset-0 z-[5]"></div>
                <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center rounded-[inherit] bg-white transition-all opacity-0 group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-cloud-upload size-7 transition-all duration-75 text-gray-500 group-hover:scale-110 group-active:scale-95 scale-100 w-5 h-5"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m16 16-4-4-4 4"></path>
                  </svg>
                  <span className="sr-only">File upload</span>
                </div>
                <img
                  src="https://dubassets.com/avatars/cm1nbaqiv0005femhnrydupgr"
                  alt="Preview"
                  className="h-full w-full rounded-[inherit] object-cover"
                />
                <div className="sr-only mt-1 flex shadow-sm">
                  <input type="file" accept="image/png,image/jpeg" />
                </div>
              </label>
            </div>
          </div>
          <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 sm:px-10">
            <p className="flex items-center h-10 text-sm text-gray-500">
              Square image recommended. Accepted file types: .png, .jpg. Max
              file size: 2MB.
            </p>
          </div>
        </div> */}

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-medium">Your Name</h2>
              <p className="text-sm text-gray-500">
                This will be your display name on Gehe.fyi
              </p>
            </div>
            <div className="flex h-10 space-x-5">
              <input
                placeholder="Alan"
                maxlength="32"
                required=""
                className="w-full px-2 max-w-sm rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm capitalize"
                type="text"
                name="name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                placeholder="Turing"
                maxlength="32"
                required=""
                className="w-full px-2 max-w-sm rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm capitalize"
                type="text"
                name="name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 sm:px-10">
            <p className="flex items-center h-10 text-sm text-gray-500">
              Maximum 32 characters.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-medium">Your Email</h2>
              <p className="text-sm text-gray-500">
                This will be the email you use to log in to Gehe.fyi
              </p>
            </div>
            <input
              placeholder="prateekrohilla4.pr@gmail.com"
              required=""
              className="w-full h-10 px-2 max-w-md rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-end space-x-4 rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 sm:px-10">
            <button className="invisible flex h-8 sm:h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm text-gray-500 border-gray-400 bg-gray-100 hover:ring-4 hover:ring-gray-200 outline-none">
              <div className="min-w-0 truncate">Send OTP</div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="h-10 rounded-md border px-4 text-sm text-gray-900 border-teal-400 bg-teal-100 hover:ring-4 hover:ring-teal-100 outline-none"
          >
            <div className="min-w-0 truncate">
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </div>
          </button>
        </div>
      </form>

      {/* Delete Form */}
      <div className="rounded-lg border border-red-600 bg-white">
        <div className="max-w-4xl flex flex-col space-y-3 p-5 sm:p-10">
          <h2 className="text-xl font-medium">Delete Account</h2>
          <p className="text-sm text-gray-500">
            Permanently delete your Gehe.fyi account, all of your workspaces,
            links and their respective stats. This action cannot be undone -
            please proceed with caution.
          </p>
        </div>
        <div className="border-b border-red-600"></div>
        <div className="flex items-center justify-end p-3 sm:px-10">
          <div>
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm transition-all border-red-500 bg-red-500 text-white hover:bg-red-600 hover:ring-4 hover:ring-red-100"
              onClick={handleDelete}
            >
              <div className="min-w-0 truncate">Delete Account</div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
