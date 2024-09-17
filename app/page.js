// app/page.js
'use client'

import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import TimeAgo from './timeAgo'
import { AuthContext } from './AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [URLs, setURLs] = useState([])
  // const {  } = useContext(AuthContext);

  const [shortenedUrl, setShortenedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(Cookies.get('jwt'))
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/signin')
    } else {
      fetchAllURLs()
    }
  }, [token, router])

  async function fetchAllURLs() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + '/shortener/all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const urls = await response.json()
      setURLs(urls)
    } catch (error) {
      console.error('Error fetching URLs:', error)
    }
  }

  const handleShortenUrl = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // setShortenedUrl("")

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + '/shortener/new',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ originalUrl: originalUrl }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const data = await response.json()
      // setShortenedUrl(data.shortUrl)
      fetchAllURLs()
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    console.log('use effect')
    fetchAllURLs()
  }, [])

  return (
    <>
      <main className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-8 mt-6 text-gray-800">
          URL Shortener
        </h1>
        <form onSubmit={handleShortenUrl} className="w-full max-w-md">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              type="url"
              placeholder="Enter the URL to shorten"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {URLs.length > 0 &&
          URLs.sort(
            (a, b) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          ).map(
            ({
              archived,
              clicks,
              createdAt,
              id,
              originalUrl,
              shortUrl,
              updatedAt,
              userId,
            }) => (
              <div
                key={id}
                className="mt-8 p-4 bg-white rounded shadow-md text-center"
              >
                <p className="text-gray-700 mb-2">Your shortened URL:</p>
                <a
                  href={'https://gehe.fyi/' + shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:text-teal-700 break-all"
                >
                  {'https://gehe.fyi/' + shortUrl}
                </a>
                <p className="text-gray-700 mb-2">Original URL:</p>
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:text-teal-700 break-all"
                >
                  {originalUrl}
                </a>
                <p className="text-sm">
                  <TimeAgo date={updatedAt} />
                </p>
              </div>
            )
          )}
      </main>
    </>
  )
}
