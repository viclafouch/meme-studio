import React from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { PagePropsWithLocaleParams } from '@i18n/config'
import QaAEnMDX from '@i18n/locales/en/md/qAa.mdx'
import QaAFrMDX from '@i18n/locales/fr/md/qAa.mdx'
import { Box, Container } from '@styled-system/jsx'
import {
  type Locales,
  locales
} from '@viclafouch/meme-studio-utilities/constants'

type PageProps = PagePropsWithLocaleParams

const qAaMDXByLocales = {
  [locales.fr]: QaAFrMDX,
  [locales.en]: QaAEnMDX
} as const satisfies { [key in Locales]: React.ElementType }

export async function generateMetadata({ params }: PagePropsWithLocaleParams) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('qAq.metadataTitle'),
    description: t('qAq.metadataDescription')
  }
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const MdxComponent = qAaMDXByLocales[locale]

  return (
    <Container maxW="8/12">
      <Box mt={6}>
        <MdxComponent />
      </Box>
    </Container>
  )
}

export default Page
