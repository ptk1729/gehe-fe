// app/page.js
'use client'

import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { RiEdit2Fill } from 'react-icons/ri'
import { TiTick } from 'react-icons/ti'
import TimeAgo from './timeAgo'
import Link from 'next/link'
import { MdContentCopy } from 'react-icons/md'
import { MdShare } from 'react-icons/md'
import { MdSubdirectoryArrowRight } from 'react-icons/md'

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

  // Fetching all URLs when the component mounts
  useEffect(() => {
    fetchAllURLs()
  }, [])

  // Function to fetch all shortened URLs from the backend
  async function fetchAllURLs() {
    setLoading(true)

    try {
      const response = await fetch(webURL + 'shortener/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const urls = await response.json()
      setURLs(urls) // Update state with fetched URLs
    } catch (error) {
      console.error('Error fetching URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to shorten a new URL
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
      setShortenedUrl(data.shortUrl) // Store the new shortened URL
      fetchAllURLs() // Refresh the list of URLs
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setTimeout(() => {
        setLoading(false) // Stop loading after operation
        setShortenedUrl('') // Clear shortened URL after a short delay
      }, 1000)
    }
  }

  // Handles selection and deselection of URLs for bulk actions
  const handleCheckboxChange = (id) => {
    if (selectedUrls.includes(id)) {
      setSelectedUrls(selectedUrls.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedUrls([...selectedUrls, id])
    }
  }

  // Toggles edit mode for a specific URL
  const toggleEditMode = (id, currentShortUrl) => {
    setIsEditable(!isEditable)
    setEditableId(id)
    setNewShortenUrl(currentShortUrl) // Store the current shortened URL for editing
  }

  // Function to edit an existing shortened URL
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

      if (response.status === 400) {
        setError(
          'Shortened URL already exists. Please choose a different name.'
        )
        return
      }

      const data = await response.json()

      // Update the state with the edited URL
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
      setIsEditable(!isEditable) // Exit edit mode
    } catch (err) {
      console.error(err)
    }
  }

  // Function to archive selected URLs
  const handleArchiveSelected = async () => {
    setLoading(true)

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
      // Update state by removing archived URLs
      const updatedURLs = URLs.filter((url) => !selectedUrls.includes(url.id))
      setURLs(updatedURLs)
      setSelectedUrls([]) // Clear selected URLs
    } catch (error) {
      console.error('Error Archive URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to delete selected URLs
  const handleDeleteSelected = async () => {
    setLoading(true)

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
      // Update state by removing deleted URLs
      const updatedURLs = URLs.filter((url) => !selectedUrls.includes(url.id))
      setURLs(updatedURLs)
      setSelectedUrls([]) // Clear selected URLs
    } catch (error) {
      console.error('Error deleting URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="relative flex flex-col items-center min-h-screen bg-[#f4f4f5]">
        {/* Header Section */}

        {/* <img
          src="your-image.svg"
          className="fixed top-0 left-0 w-full h-auto"
          alt="SVG Image"
        /> */}

        <div className="h-[40vh] bg-[#27272a] w-full flex justify-center items-center">
          <h1 className="text-4xl md:text-4xl font-bold mb-16 mt-6 text-white">
            URL Shortener
          </h1>
        </div>

        {/* URL Shortening Form */}
        <div className="static inset-0 flex justify-center items-center mb-8 md:mb-16 mx-2">
          <form
            onSubmit={handleShortenUrl}
            className="absolute w-full max-w-xl bg-white px-2 py-3 md:px-6 md:py-4 rounded-md shadow-lg "
          >
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
        </div>

        {/* Display error or shortened URL */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {shortenedUrl && (
          <p className="mt-4 text-green-500">Shortened URL: {shortenedUrl}</p>
        )}
        {/* {loading ? (
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="w-4 h-4 rounded-full bg-teal-500 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-4 h-4 rounded-full bg-teal-500 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-teal-500 animate-bounce [animation-delay:.7s]"></div>
          </div>
        ) : URLs.length > 0 ? (
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
                      readOnly
                    />
                  </th>

                  <th className="px-4 py-2">Original URL</th>
                  <th className="px-4 py-2">Shortened URL</th>
                  <th className="px-4 py-2">Clicks</th>
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
                      <td className="px-4 py-2 break-all">
                        <a
                          href={originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 hover:text-teal-700"
                        >
                          {originalUrl.substring(0, 15)}...
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
          ''
        )} */}

        {/* display the list of URLs */}

        {loading ? (
          <div className="my-10 mx-2 w-full max-w-xl overflow-x-auto">
            <ul className="mt-3 grid gap-2">
              {[...Array(4)].map((_, index) => (
                <li
                  key={index}
                  className="flex items-center rounded-xl border-gray-200 bg-white p-3 shadow-lg"
                >
                  <div>
                    <div className="mb-2.5 flex items-center space-x-2">
                      <div className="h-6 w-28 rounded-md bg-gray-200"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                      <div className="h-6 w-20 rounded-md bg-gray-200"></div>
                    </div>
                    <div className="h-4 w-60 rounded-md bg-gray-200 sm:w-80"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : URLs.length > 0 ? (
          <div className="my-10 mx-2 w-full max-w-xl overflow-x-auto">
            <ul className="mx-2 my-2 grid gap-2">
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
                  <li
                    key={id}
                    className="flex items-center rounded-xl border-gray-200 bg-white p-3 shadow-lg"
                  >
                    <div className="flex space-x-3 items-start flex-shrink-0">
                      <div>
                        <input
                          type="checkbox"
                          className="ml-1 md:ml-2 mt-2 accent-teal-600"
                          onChange={() => handleCheckboxChange(id)}
                        />
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-2">
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
                              className="text-base md:text-lg text-teal-500 hover:text-teal-600 hover:underline font-semibold"
                            >
                              {'gehe.fyi/' + shortUrl}
                            </a>
                          )}
                          <button className="rounded-full p-1.5 transition-all duration-75 border border-gray-200 bg-gray-50 hover:scale-100 hover:bg-gray-100 active:bg-gray-100">
                            <MdContentCopy className="text-sm md:text-base" />
                          </button>
                          {/* <button className="rounded-full p-1.5 transition-all duration-75 border border-gray-200 bg-gray-50 hover:scale-100 hover:bg-gray-100 active:bg-gray-100">
                            <MdShare />
                          </button> */}
                          <button className="rounded-full p-1.5 transition-all duration-75 border border-gray-200 bg-gray-50 hover:scale-100 hover:bg-gray-100 active:bg-gray-100">
                            <span>
                              {isEditable && editableId === id ? (
                                <TiTick
                                  className="text-sm md:text-base"
                                  onClick={() => handleEditUrl(id)}
                                />
                              ) : (
                                <RiEdit2Fill
                                  className="text-sm md:text-base"
                                  onClick={() => toggleEditMode(id, shortUrl)}
                                />
                              )}
                            </span>
                          </button>
                          <button className="flex items-center gap-x-1 rounded-md border border-gray-200 bg-gray-50 px-3 p-0.5 transition-colors hover:bg-gray-100 text-sm md:text-base">
                            <span>
                              <svg
                                height="18"
                                width="18"
                                viewBox="0 0 18 18"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-700"
                              >
                                <g fill="currentColor">
                                  <path
                                    d="M8.095,7.778l7.314,2.51c.222,.076,.226,.388,.007,.47l-3.279,1.233c-.067,.025-.121,.079-.146,.146l-1.233,3.279c-.083,.219-.394,.215-.47-.007l-2.51-7.314c-.068-.197,.121-.385,.318-.318Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                  ></path>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    x1="12.031"
                                    x2="16.243"
                                    y1="12.031"
                                    y2="16.243"
                                  ></line>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    x1="7.75"
                                    x2="7.75"
                                    y1="1.75"
                                    y2="3.75"
                                  ></line>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    x1="11.993"
                                    x2="10.578"
                                    y1="3.507"
                                    y2="4.922"
                                  ></line>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    x1="3.507"
                                    x2="4.922"
                                    y1="11.993"
                                    y2="10.578"
                                  ></line>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    x1="1.75"
                                    x2="3.75"
                                    y1="7.75"
                                    y2="7.75"
                                  ></line>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    x1="3.507"
                                    x2="4.922"
                                    y1="3.507"
                                    y2="4.922"
                                  ></line>
                                </g>
                              </svg>
                            </span>
                            {clicks}{' '}
                            <span className="hidden md:block"> clicks</span>
                          </button>
                        </div>

                        <div className="flex">
                          <span className="text-[#9ca3af] pt-1 pr-1">
                            <svg
                              viewBox="0 0 18 18"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-400"
                            >
                              <g fill="currentColor">
                                <path
                                  d="M15.25,9.75H4.75c-1.105,0-2-.895-2-2V3.75"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                ></path>
                                <polyline
                                  fill="none"
                                  points="11 5.5 15.25 9.75 11 14"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                ></polyline>
                              </g>
                            </svg>
                          </span>
                          <a
                            href={originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-black hover:opacity-80 text-[#9ca3af] text-sm md:text-base"
                          >
                            {originalUrl.substring(0, 40)}...
                          </a>
                        </div>

                        {/* <div className="flex space-x-4">
                          <span className="text-xs">{clicks} : clicks</span>
                          <span className="text-xs">
                            <TimeAgo date={createdAt} title={'Created at'} />
                          </span>
                          <span className="text-xs">
                            <TimeAgo date={updatedAt} title={'Updated'} />
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          ''
        )}

        {deletedUrl && (
          <p className="mt-4 text-green-500">Shortened URL: {deletedUrl}</p>
        )}

        {selectedUrls.length > 0 && (
          <div
            className={`action_menu fixed bottom-[-100%] md:right-2 transform transition-transform duration-500 ease-in-out ${
              selectedUrls.length > 0 ? 'bottom-[6%] ' : ''
            } flex justify-between items-center text-teal-500 bg-white rounded w-full md:w-[400px] h-16 px-2 py-4 border shadow-xl`}
          >
            <div>
              <span className="p-1 bg-teal-500 text-white rounded text-sm">
                {selectedUrls.length}
              </span>{' '}
              <span className="text-base">document selected</span>
            </div>

            <div className="flex gap-2 md:gap-3">
              <button
                type="submit"
                className={` bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white px-2 rounded `}
                onClick={handleDeleteSelected}
              >
                Delete
              </button>
              <button
                className={` bg-white hover:bg-[#f3f4f6] border-teal-500 text-sm border text-teal-500 py-1 px-2 rounded `}
                onClick={handleArchiveSelected}
              >
                Archive
              </button>
            </div>
          </div>
        )}
        {/* <div className="static md:fixed md:right-0 md:bottom-28 md:-rotate-90">
          <Link
            href="/archive"
            className="text-[#26a8ed] hover:underline underline-offset-2"
          >
            View the archives →
          </Link>
        </div> */}
      </main>
    </>
  )
}
