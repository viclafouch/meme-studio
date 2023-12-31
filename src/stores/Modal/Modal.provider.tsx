'use client'

import React from 'react'
import Modal from 'react-responsive-modal'
import { create } from 'zustand'
import { useIsomorphicLayoutEffect } from '@viclafouch/meme-studio-utilities/hooks'
import { MODALS } from './Modals.constants'
import 'react-responsive-modal/styles.css'

type Modals = typeof MODALS
type ModalKey = keyof Modals

const initialState: {
  component: Modals[ModalKey]['component'] | null
  componentName: ModalKey | null
  isOpen: boolean
  componentProps: React.ComponentProps<Modals[ModalKey]['component']> | null
} = {
  component: null,
  componentProps: null,
  isOpen: false,
  componentName: null
}

export const useModal = create<
  typeof initialState & {
    closeModal: () => void
    showModal: <T extends ModalKey>(
      componentName: T,
      componentProps: React.ComponentProps<Modals[T]['component']>
    ) => void
  }
>((set) => {
  return {
    ...initialState,
    closeModal: () => {
      set({
        isOpen: false
      })
    },
    showModal: <T extends ModalKey>(
      componentName: T,
      componentProps: React.ComponentProps<Modals[T]['component']>
    ) => {
      const modal = MODALS[componentName]

      if (!modal) {
        throw new Error(
          `The modal '${componentName}' has no existing component`
        )
      }

      set({
        component: modal.component,
        componentName: componentName as T,
        componentProps,
        isOpen: true
      })
    }
  }
})

export function useShowModal() {
  return useModal((state) => {
    return state.showModal
  })
}

export function useCloseModal() {
  return useModal((state) => {
    return state.closeModal
  })
}

export const ModalOutlet = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  const {
    component: Component,
    componentProps,
    isOpen,
    closeModal
  } = useModal()

  React.useEffect(() => {
    if (isOpen) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeModal()
        }
      }

      window.addEventListener('keydown', handleEscape, false)

      return () => {
        window.removeEventListener('keydown', handleEscape, false)
      }
    }

    return () => {}
  }, [closeModal, isOpen])

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  // Only on client side (we are reading on document.body)
  if (!isMounted) {
    return null
  }

  return (
    <React.Suspense fallback={null}>
      <Modal open={isOpen} onClose={closeModal} center>
        {Component && componentProps ? (
          // @ts-expect-error
          <Component {...componentProps} />
        ) : (
          <div />
        )}
      </Modal>
    </React.Suspense>
  )
}
