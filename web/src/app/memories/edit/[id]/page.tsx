import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { api } from '@/lib/api'

import { NewMemoryForm } from '@/components/NewMemoryForm'

interface IMemory {
  id: string
  user_id: string
  cover_url?: string
  content: string
  is_public: boolean
  created_at: string
}

const videoRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/

export default async function EditMemory({
  params,
}: {
  params: { id: string }
}) {
  const token = cookies().get('spacetimeToken')?.value
  const id = params.id
  let data: IMemory

  try {
    const response = await api.get(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    data = response.data
  } catch (error) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>
      <NewMemoryForm
        cover_url={data.cover_url}
        content={data.content}
        is_public={data.is_public}
        memory_id={id}
        is_video={videoRegex.test(data.cover_url as string)}
      />
    </div>
  )
}
