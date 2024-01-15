import React from 'react'

export const MODALS = {
  export: {
    component: React.lazy(() => {
      return import('@components/Modals/ExportModal')
    })
  },
  qaa: {
    component: React.lazy(() => {
      return import('@components/Modals/QaAModal')
    })
  },
  gallery: {
    component: React.lazy(() => {
      return import('@components/Modals/GalleryModal')
    })
  }
} as const
