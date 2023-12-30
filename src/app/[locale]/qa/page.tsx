import React from 'react'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { PagePropsWithLocaleParams } from '@i18n/config'
import QaAEnMDX from '@i18n/locales/en/md/qAa.mdx'
import QaAFrMDX from '@i18n/locales/fr/md/qAa.mdx'
import { css } from '@styled-system/css'
import { Box, Container } from '@styled-system/jsx'
import { Locales, locales } from '@viclafouch/meme-studio-utilities/constants'

type PageProps = PagePropsWithLocaleParams

const qAaMDXByLocales = {
  [locales.fr]: QaAFrMDX,
  [locales.en]: QaAEnMDX
} as const satisfies { [key in Locales]: React.ElementType }

export async function generateMetadata({
  params: { locale }
}: PagePropsWithLocaleParams) {
  const t = await getTranslations({ locale })

  return {
    title: t('qAq.metadataTitle'),
    description: t('qAq.metadataDescription')
  }
}

const Page = ({ params }: PageProps) => {
  unstable_setRequestLocale(params.locale)

  const MdxComponent = qAaMDXByLocales[params.locale]

  return (
    <Container maxW="8/12">
      <Box mt={6}>
        <MdxComponent
          components={{
            a: (props) => {
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              return <a className={css({ color: 'primary' })} {...props} />
            }
          }}
        />
      </Box>
    </Container>
  )
}

export default Page
