import React from 'react'
import { getTranslations } from 'next-intl/server'
import type { PagePropsWithLocaleParams } from '@i18n/config'
import AboutEnMDX from '@i18n/locales/en/md/about.mdx'
import AboutFrMDX from '@i18n/locales/fr/md/about.mdx'
import { Box, Container } from '@styled-system/jsx'
import {
  type Locales,
  locales
} from '@viclafouch/meme-studio-utilities/constants'

type PageProps = PagePropsWithLocaleParams

const aboutMDXByLocales = {
  [locales.fr]: AboutFrMDX,
  [locales.en]: AboutEnMDX
} as const satisfies { [key in Locales]: React.ElementType }

export async function generateMetadata({ params }: PagePropsWithLocaleParams) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('about.metadataTitle'),
    description: t('about.metadataDescription')
  }
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params

  const MdxComponent = aboutMDXByLocales[locale]

  return (
    <Container maxW="8/12">
      <Box mt={6}>
        <MdxComponent />
        <Box mt={10}>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=viclafouch&repo=meme-studio&type=star&count=true"
            width="90px"
            title="Github repo"
            height="20px"
            sandbox="allow-scripts"
          />
          <br />
          <iframe
            src="https://ghbtns.com/github-btn.html?user=viclafouch&type=follow&count=true"
            width="170px"
            height="20px"
            title="Github stars"
            sandbox="allow-scripts"
          />
        </Box>
      </Box>
    </Container>
  )
}

export default Page
