import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface IGetUserProps {
  name: string
  avatar_url: string
  sub: string
}

export function getUser(): IGetUserProps {
  const token = cookies().get('spacetimeToken')?.value

  if (!token) {
    throw new Error('Unhauthenticated')
  }

  const user: IGetUserProps = decode(token)
  return user
}
