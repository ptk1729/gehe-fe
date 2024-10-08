// components/MobileNav.js
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { useRouter } from 'next/navigation'

export default function MobileNav() {
  const { token, logout } = useContext(AuthContext)
  const router = useRouter()

  async function handleSignOut() {
    try {
      await logout()
      router.push('/signin')
    } catch (error) {
      console.error('error logging out', error)
    }
  }

  return (
    <div className="sm:hidden" id="mobile-menu">
      <div className="pt-2 pb-3 space-y-1">
        <Link href="/">
          <span className="block pl-3 pr-4 py-2 border-l-4 border-teal-500 text-base font-medium text-teal-700 bg-teal-50 cursor-pointer">
            Home
          </span>
        </Link>
        <Link href="/archive">
          <span className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 cursor-pointer">
            Archive
          </span>
        </Link>
        <Link href="/profile">
          <span className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 cursor-pointer">
            Profile
          </span>
        </Link>
      </div>

      {token ? (
        <>
          {/* Sign Out Button */}

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-4">
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-gray-900 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Sign In and Sign Up Buttons */}

          <div className="pt-4 pb-3 border-t border-gray-200">
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
          </div>
        </>
      )}
    </div>
  )
}
