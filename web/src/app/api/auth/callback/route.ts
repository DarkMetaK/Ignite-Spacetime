import { NextRequest, NextResponse } from 'next/server'

import { api } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const registerResponse = await api.post('/register', {
    code,
  })
  const { token } = registerResponse.data

  const redirectTo = request.cookies.get('redirectTo')?.value
  const redirectURL = redirectTo ?? new URL('/', request.url)
  const cookiesExpiresInSeconds = 60 * 60 * 24 * 30 // 30 days

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `spacetimeToken=${token}; Path=/; max-age=${cookiesExpiresInSeconds}`,
    },
  })
}
