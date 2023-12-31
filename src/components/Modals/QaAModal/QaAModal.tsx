import React from 'react'
import { useLocale } from 'next-intl'
import QaAEnMDX from '@i18n/locales/en/md/qAa.mdx'
import QaAFrMDX from '@i18n/locales/fr/md/qAa.mdx'
import { Container } from '@styled-system/jsx'
import { Locales, locales } from '@viclafouch/meme-studio-utilities/constants'

const qAaMDXByLocales = {
  [locales.fr]: QaAFrMDX,
  [locales.en]: QaAEnMDX
} as const satisfies { [key in Locales]: React.ElementType }

const QaAModal: React.FC = () => {
  const locale = useLocale() as Locales
  const MdxComponent = qAaMDXByLocales[locale]

  return (
    <Container>
      <MdxComponent />
    </Container>
  )
}

export default QaAModal
