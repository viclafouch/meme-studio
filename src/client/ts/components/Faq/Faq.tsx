import * as React from 'react'
import { useState, useImperativeHandle, forwardRef } from 'react'
import Modal from '@client/components/Modal/Modal'
import './faq.scss'

const Faq = forwardRef(
  (props: any, ref): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false)

    useImperativeHandle(
      ref,
      () => ({
        open: (): void => setIsOpen(true),
        close: (): void => setIsOpen(false),
      }),
      [setIsOpen]
    )

    return isOpen ? (
      <Modal onClose={(): void => setIsOpen(false)}>
        <div className="faq">
          <h1>F.A.Q</h1>
          <div className="faq-body">
            <h2>Comment personnaliser un meme ?</h2>
            <p>
              Pour personnaliser un mème, rien de plus simple : Sélectionner un mème parmis ceux proposés dans la liste, ou en
              utilisant une image de votre appareil. Utilisez ensuite les zones de textes et les outils à votre gauche pour
              personnaliser au mieux votre oeuvre !
            </p>
            <h2>Comment exporter un meme ?</h2>
            <p>
              Un bouton est disponible en haut à droite, vous permettant d'exporter votre oeuvre à sa taille originale au format
              PNG.
            </p>
            <h2>Comment participer à l'amélioration du site ?</h2>
            <p>
              J'ai créé un formulaire Google vous permettant de partager vos idées et de me faire remonter les bugs identifiés :{' '}
              <a href="https://forms.gle/KT2wHbobQwKLXDo1A" target="_blank">
                https://forms.gle/KT2wHbobQwKLXDo1A
              </a>
              .
            </p>
          </div>
        </div>
      </Modal>
    ) : null
  }
)

export default Faq
