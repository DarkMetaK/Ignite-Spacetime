'use client'
import { ChangeEvent, useState } from 'react'

interface IMediaPickerProps {
  cover_url?: string
  is_video?: boolean
}

export function MediaPicker({ cover_url, is_video }: IMediaPickerProps) {
  const [isVideo, setIsVideo] = useState<boolean>(is_video || false)
  const [maximumSizeReached, setMaximumSizeReached] = useState<boolean>(false)
  const [uploadedFilePreviewUrl, setUploadedFilePreviewUrl] = useState<
    string | null
  >(cover_url || null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    if (files[0].size > 5_242_880) {
      setMaximumSizeReached(true)
      setUploadedFilePreviewUrl(null)
      event.target.value = ''
      return
    }
    setMaximumSizeReached(false)

    const mimeTypeRegex = /^(video)\/[a-zA-Z]+/
    const isFileAVideo = mimeTypeRegex.test(files[0].type)
    isFileAVideo ? setIsVideo(true) : setIsVideo(false)

    setUploadedFilePreviewUrl(URL.createObjectURL(files[0]))
  }

  return (
    <>
      <input
        type="file"
        id="midia"
        name="coverUrl"
        className="invisible h-0 w-0"
        accept="image/*, video/*"
        onChange={handleFileChange}
      />

      {!isVideo && uploadedFilePreviewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={uploadedFilePreviewUrl}
          alt=""
          className={`aspect-video w-full rounded-lg object-cover`}
        />
      )}

      {isVideo && uploadedFilePreviewUrl && (
        <video
          controls
          className={`aspect-video w-full rounded-lg`}
          src={uploadedFilePreviewUrl}
        />
      )}

      {maximumSizeReached && (
        <p className="text-sm leading-snug text-red-400">
          O tamanho máximo permitido é 5mb.
        </p>
      )}
    </>
  )
}
