import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import Modal from '@components/Modal/Modal'
import { wait } from '@utils/index'

type ExportProps = {
  onClose: Function
  canvas: React.RefObject<HTMLCanvasElement>
}

function Export(props: ExportProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [img, setImg] = useState<string>(null)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const dataUrl: string = props.canvas.current.toDataURL()
      setImg(dataUrl)
      await wait()
      setIsLoading(false)
    })()
  }, [])

  const handleClose = (): void => {
    props.onClose()
    setImg(null)
  }

  return (
    <Modal onClose={handleClose} isLoading={isLoading}>
      <img src={img} />
    </Modal>
  )
}

export default Export
