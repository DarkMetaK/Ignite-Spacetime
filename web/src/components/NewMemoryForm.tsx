'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { parseCookies } from 'nookies'
import { MediaPicker } from '@/components/MediaPicker'
import { api } from '@/lib/api'

interface INewMemoryFormProps {
  cover_url?: string
  content?: string
  is_public?: boolean
  memory_id?: string
  is_video?: boolean
}

export function NewMemoryForm({
  content,
  cover_url,
  is_public,
  memory_id,
  is_video,
}: INewMemoryFormProps) {
  const router = useRouter()
  const [textContent, setTextContent] = useState(content || '')
  const [ischecked, setIsChecked] = useState(is_public || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const { spacetimeToken } = parseCookies()

    if (textContent.length) {
      const formData = new FormData(event.currentTarget)
      const fileToUpload = formData.get('coverUrl') as File
      let new_cover_url = ''

      if (fileToUpload.name.length) {
        const uploadFormData = new FormData()
        uploadFormData.set('file', fileToUpload)

        const uploadResponse = await api.post('/upload', uploadFormData)
        new_cover_url = uploadResponse.data.fileURL
      }

      if (memory_id) {
        await api.put(
          `/memories/${memory_id}`,
          {
            cover_url: new_cover_url.length ? new_cover_url : undefined,
            content: formData.get('content'),
            is_public: !!formData.get('isPublic'),
          },
          {
            headers: {
              Authorization: `Bearer ${spacetimeToken}`,
            },
          },
        )
        router.refresh()
        router.push(`${window.location}`.replace('edit/', ''))
      } else {
        await api.post(
          `/memories`,
          {
            cover_url: new_cover_url.length ? new_cover_url : undefined,
            content: formData.get('content'),
            is_public: !!formData.get('isPublic'),
          },
          {
            headers: {
              Authorization: `Bearer ${spacetimeToken}`,
            },
          },
        )
        router.refresh()
        router.push('/')
      }
    } else {
      setIsSubmitting(false)
      setError('A memória deve possuir algum conteúdo textual')
    }
  }

  return (
    <form className="flex flex-1 flex-col gap-2" onSubmit={handleCreateMemory}>
      <div className="flex items-center gap-4">
        <label
          htmlFor="midia"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-200">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={ischecked}
            onChange={() => setIsChecked(!ischecked)}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker cover_url={cover_url} is_video={is_video} />

      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
      />

      {error && <p className="text-sm leading-snug text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm font-bold uppercase leading-none text-black hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Salvar
      </button>
    </form>
  )
}
