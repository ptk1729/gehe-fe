// components/Navbar.js
'use client'

import { useContext, useState } from 'react'
import Link from 'next/link'
import MobileNav from './MobileNav'
import { AuthContext } from './AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { token, logout } = useContext(AuthContext)
  const router = useRouter()

  async function handleSignOut() {
    try {
      await logout()
      router.push('/signin')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo or App Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-xl font-bold text-teal-600 cursor-pointer">
                Shortify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links and Buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link href="/">
                <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                  Home
                </span>
              </Link>
              <Link href="/about">
                <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                  About
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                  Contact
                </span>
              </Link>
            </div>

            {token ? (
              <>
                {/* Sign Out Button */}

                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Sign In and Sign Up Buttons */}

                <div className="flex items-center px-4 space-x-4">
                  <Link href="/signin">
                    <button className="w-full text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="w-full bg-teal-500 hover:bg-teal-700 text-white px-3 py-2 rounded-md text-base font-medium">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-teal-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8h16M4 16h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Links and Buttons */}
      {isOpen && <MobileNav />}
    </nav>
  )
}
