'use client'
import { formatDistanceToNow } from 'date-fns'

function TimeAgo({ date, title }) {
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true })
  return (
    <span>
      {title} {timeAgo}
    </span>
  )
}

export default TimeAgo
