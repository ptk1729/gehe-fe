import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublic = path === '/signin' || path === '/signup'

  const token = request.cookies.get('jwt')?.value

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/archive', '/profile', '/signin', '/signup'],
}
