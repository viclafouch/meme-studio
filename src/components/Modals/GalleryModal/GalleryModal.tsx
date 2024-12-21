import React from 'react'
import Gallery from '@studio/components/Aside/Tabs/Gallery'
import type { Meme } from '@viclafouch/meme-studio-utilities/schemas'

export type GalleryModalProps = {
  memesPromise: Promise<Meme[]>
}

const GalleryModal = ({ memesPromise }: GalleryModalProps) => {
  return <Gallery memesPromise={memesPromise} />
}

export default GalleryModal
