import React from 'react'

export const MODALS = {
  export: {
    component: React.lazy(() => {
      return import('@components/Modals/ExportModal')
    })
  }
} as const
