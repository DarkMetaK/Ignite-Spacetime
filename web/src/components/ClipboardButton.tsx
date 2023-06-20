'use client'
import { useState, useRef } from 'react'
import * as Toast from '@radix-ui/react-toast'

interface IDeleteMemoryButton {
  is_public: boolean
}

export function ClipboardButton({ is_public }: IDeleteMemoryButton) {
  const [isToastOpen, setIsToastOpen] = useState(false)
  // eslint-disable-next-line no-undef
  const timerRef = useRef<NodeJS.Timeout>()

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(`${window.location}`)
    setIsToastOpen(false)
    window.clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      setIsToastOpen(true)
    }, 100)
  }

  return (
    <Toast.Provider swipeDirection="right" duration={2000}>
      <button
        className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm font-bold uppercase leading-none text-black hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-30"
        disabled={!is_public}
        title={
          is_public
            ? 'Envie o link para quem quiser!'
            : 'A memória precisa estar pública para ser compartilhada.'
        }
        onClick={handleCopyToClipboard}
      >
        Compartilhar Memória
      </button>

      <Toast.Root
        className="grid-cols-[auto max-content] grid items-center gap-2 rounded-md bg-gray-700 p-4 shadow-sm data-[state='closed']:animate-toast-closed data-[state='open']:animate-toast-open data-[swipe='end']:animate-toast-end"
        open={isToastOpen}
        onOpenChange={setIsToastOpen}
      >
        <Toast.Title className="text-base leading-tight text-purple-500">
          Copiado para área de transferência
        </Toast.Title>
        <Toast.Description asChild>
          <p className="text-sm leading-relaxed text-gray-100">
            Agora basta compartilhar o link para que outros usuários tenham
            acesso!
          </p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-50 m-0 flex w-96 max-w-[100vw] list-none flex-col gap-2 p-6 outline-none" />
    </Toast.Provider>
  )
}
