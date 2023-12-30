import React from 'react'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { PagePropsWithLocaleParams } from '@i18n/config'
import AboutEnMDX from '@i18n/locales/en/md/about.mdx'
import AboutFrMDX from '@i18n/locales/fr/md/about.mdx'
import { css } from '@styled-system/css'
import { Box, Container } from '@styled-system/jsx'
import { Locales, locales } from '@viclafouch/meme-studio-utilities/constants'

type PageProps = PagePropsWithLocaleParams

const aboutMDXByLocales = {
  [locales.fr]: AboutFrMDX,
  [locales.en]: AboutEnMDX
} as const satisfies { [key in Locales]: React.ElementType }

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams) {
  const t = await getTranslations({ locale })

  return {
    title: t('about.metadataTitle'),
    description: t('about.metadataDescription')
  }
}

const Page = ({ params }: PageProps) => {
  unstable_setRequestLocale(params.locale)

  const MdxComponent = aboutMDXByLocales[params.locale]

  return (
    <Container maxW="8/12">
      <Box mt={6}>
        <MdxComponent
          components={{
            h1: (props) => {
              // eslint-disable-next-line jsx-a11y/heading-has-content
              return <h1 className={css({ fontSize: 'xx-large' })} {...props} />
            },
            a: (props) => {
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              return <a className={css({ color: 'primary' })} {...props} />
            }
          }}
        />
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
