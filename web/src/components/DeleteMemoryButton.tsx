'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface IDeleteMemoryButton {
  token: string
  id: string
}

export function DeleteMemoryButton({ token, id }: IDeleteMemoryButton) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleDeleteMemory() {
    setIsSubmitting(true)
    await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    router.refresh()
    router.push('/')
  }

  return (
    <button
      className="inline-block rounded-full bg-red-500 px-5 py-3 font-alt text-sm font-bold uppercase leading-none text-black hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30"
      onClick={handleDeleteMemory}
      disabled={isSubmitting}
    >
      Apagar
    </button>
  )
}
