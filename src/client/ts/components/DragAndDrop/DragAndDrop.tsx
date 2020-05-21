import * as React from 'react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import './drag-and-drop.scss'

type DragAndDropProps = {
  onDrop: (files: FileList) => void
  id: string
}

function DragAndDrop({ onDrop, id }: DragAndDropProps): JSX.Element {
  const { t } = useTranslation()
  const [containerEl] = useState(document.createElement('div'))
  const [isActive, setIsActive] = useState(false)

  const handleDragEnter = (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsActive(false)
    onDrop(e.dataTransfer.files)
  }

  useEffect(() => {
    let dragAndDropRoot = document.getElementById(id)
    if (!dragAndDropRoot) {
      const tempEl = document.createElement('div')
      tempEl.id = id
      document.getElementById('app-root').after(tempEl)
      dragAndDropRoot = tempEl
    }
    dragAndDropRoot.appendChild(containerEl)
    document.addEventListener('dragenter', handleDragEnter)
    return (): void => {
      dragAndDropRoot.removeChild(containerEl)
      document.removeEventListener('dragenter', handleDragEnter)
    }
  }, [containerEl, id])

  return createPortal(
    isActive ? (
      <div
        className={`drag-and-drop ${isActive ? 'drag-and-drop-active' : ''}`}
        onDragOver={(e: React.DragEvent<HTMLDivElement>): void => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-dropeffect="execute"
      >
        <span className="drag-and-drop-text">{t('studio.dropImage')}</span>
      </div>
    ) : (
      <div></div>
    ),
    containerEl
  )
}

export default DragAndDrop
