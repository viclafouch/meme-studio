import React from 'react'
import { toast, type ToastOptions } from 'react-toastify'
import { useTranslations } from 'next-intl'

export const useNotifications = () => {
  const t = useTranslations()

  type TextKey = Parameters<typeof t>[0]

  const notifyError = React.useCallback(
    (text?: Parameters<typeof t>[0]) => {
      toast(text || t('common.errors.unknown'), {
        type: 'error'
      })
    },
    [t]
  )

  const notifySuccess = React.useCallback(
    (text: TextKey) => {
      toast(t(text), {
        type: 'success'
      })
    },
    [t]
  )

  return {
    notifyError,
    notifySuccess,
    notify: React.useCallback((text: TextKey, options: ToastOptions) => {
      return toast(text, options)
    }, [])
  }
}
