import { cookies } from 'next/headers'
import { api } from '@/lib/api'

import { EmptyMemories } from '@/components/EmptyMemories'
import { MemoryPreview } from '@/components/MemoryPreview'

interface MemoriesPreview {
  id: string
  cover_url: string
  excerpt: string
  created_at: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('spacetimeToken')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('spacetimeToken')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const memories: MemoriesPreview[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <MemoryPreview key={memory.id} {...memory} />
      ))}
    </div>
  )
}
