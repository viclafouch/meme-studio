import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import Footer from '@components/Footer'
import LinkButton from '@components/LinkButton'
import LocaleSelector from '@components/LocaleSelector'
import MemesList from '@components/MemesList'
import { getMemes } from '@shared/api/memes'
import { css } from '@styled-system/css'
import { Box, Center, Container, VStack } from '@styled-system/jsx'
import { particulesBg } from '@styled-system/patterns'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'

type PageProps = {
  locale: Locales
}

const HomePage = async ({ locale }: PageProps) => {
  const memes = await getMemes({ locale })
  const memesSliced = memes.slice(0, 3)
  const t = await getTranslations()

  return (
    <VStack h="100vh" bgColor="secondary" className={particulesBg()}>
      <Box position="absolute" right={30} top={30}>
        <LocaleSelector />
      </Box>
      <Center flexDir="column" marginTop="14" flex={1} textAlign="center">
        <Image
          alt="Meme Studio logo"
          width={350}
          height={67}
          priority
          src="/images/logo-meme-studio-dark.png"
        />
        <Container maxW="2xl">
          <p className={css({ mt: '3', fontSize: 'xl', mb: '5' })}>
            {t('common.intro')}
          </p>
          <LinkButton color="primaryDark" size="large" rounded href="/create">
            {t('common.getStarted')}
          </LinkButton>
          <Box mt="7">
            <MemesList
              className={css({
                display: 'grid',
                gridTemplateColumns: {
                  md: 'repeat(3, 1fr)',
                  sm: 'repeat(1, 1fr)'
                },
                gap: 5,
                '& > li': {
                  height: {
                    md: '20vh',
                    sm: '300px'
                  },
                  border: '2px solid white',
                  overflow: 'hidden'
                },
                '& > li > a > img': {
                  objectFit: 'cover',
                  height: '100%!important'
                }
              })}
              memes={memesSliced}
            />
          </Box>
        </Container>
      </Center>
      <Footer />
    </VStack>
  )
}

export default HomePage
