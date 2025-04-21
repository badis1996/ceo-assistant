import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')

  // Pages that don't require authentication
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // Check auth
  if (!session) {
    // Redirect to login if there's no session
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
} 