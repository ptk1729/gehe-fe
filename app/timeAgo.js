"use client"
import { formatDistanceToNow } from 'date-fns'

function TimeAgo({ date }) {
    const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true })
    return <span>Updated {timeAgo}</span>
}

export default TimeAgo
