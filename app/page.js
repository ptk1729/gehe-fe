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
      console.error('Error Archive URLs:', error)
    }
  }

  return (
    <>
      <main className="relative flex flex-col items-center min-h-screen bg-gray-100 p-4">
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
        {
          <div className="my-10 border-2 rounded-3xl bg-[#fff]">
            <div className="h-20 flex items-center mx-4">
              <h2 className="font-bold">Shortify History</h2>
            </div>
            <table className="w-full max-w-5xl table-auto border-collapse border-none border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-tborder-gray-300 px-4 py-2">
                    <input
                      type="checkbox"
                      className="transform scale-150"
                      checked={selectedUrls.length === URLs.length}
                    />
                  </th>
                  <th className="border-tborder-gray-300 px-4 py-2">URL Id</th>
                  <th className="border-tborder-gray-300 px-4 py-2">
                    Original URL
                  </th>
                  <th className="border-tborder-gray-300 px-4 py-2">
                    Shortened URL
                  </th>
                  <th className="border-tborder-gray-300 px-4 py-2">Clicks</th>
                  <th className="border-tborder-gray-300 px-4 py-2">
                    Archived
                  </th>
                  {/* <th className="border-tborder-gray-300 px-4 py-2">User Id</th> */}
                  <th className="border-tborder-gray-300 px-4 py-2">
                    Creation Date
                  </th>
                  <th className="border-tborder-gray-300 px-4 py-2">
                    Last Updated
                  </th>
                  <th className="border-tborder-gray-300 px-4 py-2"></th>
                  <th className="border-tborder-gray-300 px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {URLs.length > 0 ? (
                  URLs.sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
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
                      <tr key={id} className="text-center">
                        <td className="border-tborder-gray-300 px-4 py-2">
                          <input
                            type="checkbox"
                            className="transform scale-150"
                            onChange={() => handleCheckboxChange(id)}
                          />
                        </td>
                        <td className="border-t border-gray-300 px-4 py-2">
                          {id}
                        </td>
                        <td className="border-t border-gray-300 px-4 py-2 break-all">
                          <a
                            href={originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-500 hover:text-teal-700 break-all"
                          >
                            {originalUrl}
                          </a>
                        </td>
                        <td className="border-t border-gray-300 px-4 py-2">
                          {isEditable && editableId === id ? (
                            <input
                              type="text"
                              value={newShortenUrl}
                              onChange={(e) => setNewShortenUrl(e.target.value)}
                              className="border p-2 bg-white rounded"
                            />
                          ) : (
                            <a
                              href={'https://gehe.fyi/' + shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-500 hover:text-teal-700 break-all"
                            >
                              {shortUrl}
                            </a>
                          )}
                        </td>

                        <td className="border-t border-gray-300 px-4 py-2">
                          {clicks}
                        </td>
                        <td className="border-t border-gray-300 px-4 py-2">
                          {archived ? 'Yes' : 'No'}
                        </td>
                        {/* <td className="border-tborder-gray-300 px-4 py-2">
                      {userId}
                    </td> */}
                        <td className="border-t border-gray-300 px-4 py-2">
                          <TimeAgo date={createdAt} title={'Created at'} />
                        </td>
                        <td className="border-t border-gray-300 px-4 py-2">
                          <TimeAgo date={updatedAt} title={'Updated'} />
                        </td>
                        {/* <td className="border-t border-gray-300 px-4 py-2">
                          <span className="text-xl">
                            <MdDelete
                              className="text-xl text-teal-500 hover:text-teal-700 cursor-pointer"
                              onClick={() => handleDelete(id)}
                            />
                          </span>
                        </td> */}
                        <td className="border-t border-gray-300 px-4 py-2">
                          <span className="text-xl">
                            {isEditable && editableId === id ? (
                              <TiTick
                                className="text-xl text-teal-500
                            hover:text-teal-700 cursor-pointer"
                                onClick={() => handleEditUrl(id)}
                              />
                            ) : (
                              <RiEdit2Fill
                                className="text-xl text-teal-500
                            hover:text-teal-700 cursor-pointer"
                                onClick={() => toggleEditMode(id, shortUrl)}
                              />
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-4 text-gray-500 w-full"
                    >
                      No URLs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }

        {deletedUrl && (
          <p className="mt-4 text-green-500">Shortened URL: {deletedUrl}</p>
        )}

        {selectedUrls.length > 0 && (
          <div
            className={`action_menu absolute transition-transform duration-500 ease-in-out transform bottom-[-100%] flex justify-between items-center text-teal-500 bg-white rounded w-[500px] h-20 px-3 py-6 border ${
              selectedUrls.length > 0 ? 'bottom-[13%]' : ''
            }`}
          >
            <div>
              <span className="p-1 bg-teal-500 text-white rounded">
                {selectedUrls.length}
              </span>{' '}
              document selected
            </div>

            <div className="flex gap-3">
              <button
                className="px-2 py-1 border rounded bg-teal-500 hover:bg-teal-700 text-white"
                onClick={handleDeleteSelected}
              >
                Delete
              </button>
              <button
                className="px-2 py-1 border rounded hover:bg-[#f3f4f6]"
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
