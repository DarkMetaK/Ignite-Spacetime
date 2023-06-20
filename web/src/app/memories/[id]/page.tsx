import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'

import { DeleteMemoryButton } from '@/components/DeleteMemoryButton'
import { ClipboardButton } from '@/components/ClipboardButton'

interface IMemory {
  id: string
  user_id: string
  cover_url?: string
  content: string
  is_public: boolean
  created_at: string
  is_owner: boolean
}

const videoRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/

export default async function Memory({ params }: { params: { id: string } }) {
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
    <div className="space-y-4 p-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dayjs(data.created_at).format('DD[ de ]MMMM[ de ]YYYY')}
      </time>
      {data.cover_url ? (
        videoRegex.test(data.cover_url) ? (
          <video
            controls
            className={`aspect-video w-full rounded-lg object-cover`}
            src={data.cover_url}
          />
        ) : (
          <Image
            src={data.cover_url}
            alt=""
            width={592}
            height={280}
            className="w-full rounded-lg object-cover"
          />
        )
      ) : null}
      <p className="text-lg leading-relaxed text-gray-100">{data.content}</p>

      {data.is_owner && (
        <div className="flex justify-between ">
          <div className="flex gap-2">
            <Link
              href={`/memories/edit/${data.id}`}
              className="inline-block rounded-full bg-yellow-500 px-5 py-3 font-alt text-sm font-bold uppercase leading-none text-black hover:bg-yellow-600"
            >
              Editar
            </Link>
            <DeleteMemoryButton id={data.id} token={token as string} />
          </div>
          <div>
            <ClipboardButton is_public={data.is_public} />
          </div>
        </div>
      )}
    </div>
  )
}
