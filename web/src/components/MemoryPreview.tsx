import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'

interface IMemoryPreviewProps {
  id: string
  cover_url: string
  excerpt: string
  created_at: string
}

const videoRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/

export function MemoryPreview({
  id,
  cover_url,
  excerpt,
  created_at,
}: IMemoryPreviewProps) {
  return (
    <div key={id} className="space-y-4">
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dayjs(created_at).format('DD[ de ]MMMM[ de ]YYYY')}
      </time>
      {cover_url ? (
        videoRegex.test(cover_url) ? (
          <video
            controls
            className={`aspect-video w-full rounded-lg object-cover`}
            src={cover_url}
          />
        ) : (
          <Image
            src={cover_url}
            alt=""
            width={592}
            height={280}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )
      ) : null}
      <p className="text-lg leading-relaxed text-gray-100">{excerpt}</p>

      <Link
        href={`/memories/${id}`}
        className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
      >
        Ler mais <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
