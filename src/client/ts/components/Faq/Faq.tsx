import * as React from 'react'
import { useState, useImperativeHandle, forwardRef, RefObject } from 'react'
import Modal from '@client/components/Modal/Modal'

const Faq = forwardRef(
  (props: any, ref): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false)

    useImperativeHandle(
      ref,
      () => ({
        open: (): void => setIsOpen(true),
        close: (): void => setIsOpen(false)
      }),
      [setIsOpen]
    )

    return isOpen ? (
      <Modal onClose={(): void => setIsOpen(false)}>
        <h2>FAQ</h2>
        <div>
          <h4>Comment créer un meme</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere ullam atque ut ex, nisi temporibus hic vitae adipisci
            aspernatur sequi eos. Ipsa nihil at quibusdam maxime harum delectus tenetur libero.
          </p>
        </div>
      </Modal>
    ) : null
  }
)

export default Faq
