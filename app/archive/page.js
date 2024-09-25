'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { MdDelete } from 'react-icons/md'
import TimeAgo from '../timeAgo'


function Archive() {
  const [archiveURLs, setArchiveURLs] = useState([])
  const [token, setToken] = useState(Cookies.get('jwt'))
  const webURL = process.env.NEXT_PUBLIC_WEB_URL

  useEffect(() => {
    fetchArchiveURLs()
  }, [])

  const fetchArchiveURLs = async () => {
    try {
      const response = await fetch(webURL + 'shortener/archived', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const archiveUrls = await response.json()
      setArchiveURLs(archiveUrls)
    } catch (error) {
      console.error('Error fetching Archive URLs:', error)
    }
  }

  const handleDeleteUrl = async (id) => {
    try {
      await fetch(webURL + `shortener/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const updatedArchiveUrl = archiveURLs.filter((url) => url.id !== id)
      setArchiveURLs(updatedArchiveUrl)
    } catch (error) {
      console.error('Error Deleting Archive URL:', error)
    }
  }

  return (
    <section className="flex flex-col items-center min-h-screen bg-[#f4f4f5]">
      {archiveURLs.length > 0 ? (
        <div className="my-10 mx-2 w-full max-w-4xl border-2 rounded-3xl bg-white overflow-x-auto">
          <div className="h-20 flex items-center mx-4">
            <h2 className="font-bold">Archive History</h2>
          </div>
          <table className="table-auto w-full border-collapse border-none">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Original URL</th>
                <th className="px-4 py-2">Shortened URL</th>
                <th className="px-4 py-2">Clicks</th>
                <th className="px-4 py-2">Creation Date</th>
                <th className="px-4 py-2">Last Updated</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {archiveURLs
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .map(
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
                        <a
                          href={'https://gehe.fyi/' + shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 hover:text-teal-700"
                        >
                          {shortUrl}
                        </a>
                      </td>
                      <td className="px-4 py-2">{clicks}</td>
                      <td className="px-4 py-2">
                        <TimeAgo date={createdAt} title={'Created at'} />
                      </td>
                      <td className="px-4 py-2">
                        <TimeAgo date={updatedAt} title={'Updated'} />
                      </td>
                      <td className="px-4 py-2">
                        <MdDelete
                          className="cursor-pointer hover:opacity-60"
                          onClick={() => handleDeleteUrl(id)}
                        />
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      ) : (
        'fetching archive URLs...'
      )}
    </section>
  )
}


export default Archive
