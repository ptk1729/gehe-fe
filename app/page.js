// app/page.js
'use client'

import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { formatDistanceToNow } from 'date-fns'
import { AuthContext } from './AuthContext'
import { useRouter } from 'next/navigation'
import { MdDelete } from 'react-icons/md'
import { RiEdit2Fill } from 'react-icons/ri'
import { TiTick } from 'react-icons/ti'
import TimeAgo from './timeAgo'

export default function Home() {
  const webURL = process.env.NEXT_PUBLIC_WEB_URL
  const [originalUrl, setOriginalUrl] = useState('')
  const [URLs, setURLs] = useState([])
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(Cookies.get('jwt'))
  const [deletedUrl, setDeletedUrl] = useState('')
  const router = useRouter()
  const [isEditable, setIsEditable] = useState(false)
  const [editableId, setEditableId] = useState(null)
  const [newShortenUrl, setNewShortenUrl] = useState('')
  const [selectedUrls, setSelectedUrls] = useState([])

  useEffect(() => {
    if (!token) {
      router.push('/signin')
    } else {
      fetchAllURLs()
    }
  }, [token, router])

  async function fetchAllURLs() {
    try {
      const response = await fetch(webURL + 'shortener/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
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

    try {
      const response = await fetch(webURL + 'shortener/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl: originalUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const data = await response.json()
      setShortenedUrl(data.shortUrl)
      fetchAllURLs()
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSelected = async () => {
    try {
      for (let id of selectedUrls) {
        await fetch(webURL + `shortener/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      }
      // Filter out the deleted URLs from the state
      const updatedURLs = URLs.filter((url) => !selectedUrls.includes(url.id))
      setURLs(updatedURLs)
      setSelectedUrls([]) // Clear the selection
    } catch (error) {
      console.error('Error deleting URLs:', error)
    }
  }

  const handleCheckboxChange = (id) => {
    if (selectedUrls.includes(id)) {
      setSelectedUrls(selectedUrls.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedUrls([...selectedUrls, id])
    }
  }

  const toggleEditMode = (id, currentShortUrl) => {
    setIsEditable(!isEditable)
    setEditableId(id)
    setNewShortenUrl(currentShortUrl)
  }

  const handleEditUrl = async (id) => {
    try {
      const response = await fetch(webURL + `shortener/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl: originalUrl,
          shortUrl: newShortenUrl,
        }),
      })

      const data = await response.json()

      const updatedURLs = URLs.map((url) => {
        if (url.id === id) {
          return {
            ...url,

            shortUrl: data.shortUrl,
            updatedAt: new Date(), // Update the timestamp
          }
        }
        return url
      })

      setURLs(updatedURLs)
      setIsEditable(!isEditable)
    } catch (err) {
      console.error(err)
    }
  }

  const handleArchiveSelected = async () => {
    try {
      for (let id of selectedUrls) {
        await fetch(webURL + `shortener/${id}/archive`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      }
      // Filter out the deleted URLs from the state
      const updatedURLs = URLs.filter((url) => !selectedUrls.includes(url.id))
      setURLs(updatedURLs)
      setSelectedUrls([]) // Clear the selection
    } catch (error) {
      console.error('Error Archive URLs:', error)
    }
  }

  return (
    <>
      <main className="relative flex flex-col items-center min-h-screen bg-gray-100 pt-4 px-2">
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
        {shortenedUrl && (
          <p className="mt-4 text-green-500">Shortened URL: {shortenedUrl}</p>
        )}
        {URLs.length > 0 ? (
          <div className="my-10 mx-2 w-full max-w-4xl border-2 rounded-3xl bg-white overflow-x-auto">
            <div className="h-20 flex items-center mx-4">
              <h2 className="font-bold">Shortify History</h2>
            </div>
            <table className="table-auto w-full border-collapse border-none">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="transform scale-150"
                      checked={selectedUrls.length === URLs.length}
                    />
                  </th>
                  <th className="px-4 py-2">URL Id</th>
                  <th className="px-4 py-2">Original URL</th>
                  <th className="px-4 py-2">Shortened URL</th>
                  <th className="px-4 py-2">Clicks</th>
                  <th className="px-4 py-2">Archived</th>
                  <th className="px-4 py-2">Creation Date</th>
                  <th className="px-4 py-2">Last Updated</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {URLs.sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                ).map(
                  ({
                    id,
                    originalUrl,
                    shortUrl,
                    clicks,
                    archived,
                    createdAt,
                    updatedAt,
                  }) => (
                    <tr key={id} className="text-center">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          className="transform scale-150"
                          onChange={() => handleCheckboxChange(id)}
                        />
                      </td>
                      <td className="px-4 py-2">{id.substring(0, 8)}...</td>
                      <td className="px-4 py-2 break-all">
                        <a
                          href={originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 hover:text-teal-700"
                        >
                          {originalUrl.substring(0, 10)}...
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        {isEditable && editableId === id ? (
                          <input
                            type="text"
                            value={newShortenUrl}
                            onChange={(e) => setNewShortenUrl(e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        ) : (
                          <a
                            href={'https://gehe.fyi/' + shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-500 hover:text-teal-700"
                          >
                            {shortUrl}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-2">{clicks}</td>
                      <td className="px-4 py-2">{archived ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2">
                        <TimeAgo date={createdAt} title={'Created at'} />
                      </td>
                      <td className="px-4 py-2">
                        <TimeAgo date={updatedAt} title={'Updated'} />
                      </td>
                      <td className="px-4 py-2">
                        {isEditable && editableId === id ? (
                          <TiTick
                            className="text-xl text-teal-500 hover:text-teal-700 cursor-pointer"
                            onClick={() => handleEditUrl(id)}
                          />
                        ) : (
                          <RiEdit2Fill
                            className="text-xl text-teal-500 hover:text-teal-700 cursor-pointer"
                            onClick={() => toggleEditMode(id, shortUrl)}
                          />
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No URL Available</p>
        )}

        {deletedUrl && (
          <p className="mt-4 text-green-500">Shortened URL: {deletedUrl}</p>
        )}

        {selectedUrls.length > 0 && (
          <div
            className={`action_menu fixed bottom-[-100%] transform transition-transform duration-500 ease-in-out ${
              selectedUrls.length > 0 ? 'bottom-[10%] md:bottom-[13%]' : ''
            } flex justify-between items-center text-teal-500 bg-white rounded w-full md:w-[500px] h-16 md:h-20 px-2 md:px-3 py-4 md:py-6 border`}
          >
            <div>
              <span className="p-1 bg-teal-500 text-white rounded text-xs md:text-base">
                {selectedUrls.length}
              </span>{' '}
              <span className="text-xs md:text-base">document selected</span>
            </div>

            <div className="flex gap-2 md:gap-3">
              <button
                className="px-2 py-1 border rounded bg-teal-500 hover:bg-teal-700 text-white text-xs md:text-base"
                onClick={handleDeleteSelected}
              >
                Delete
              </button>
              <button
                className="px-2 py-1 border rounded hover:bg-[#f3f4f6] text-xs md:text-base"
                onClick={handleArchiveSelected}
              >
                Archive
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
