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
  }
} as const
