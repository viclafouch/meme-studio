import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Footer from '@components/Footer'
import LinkButton from '@components/LinkButton'
import MemesList from '@components/MemesList'
import { css } from '@styled-system/css'
import { Box, Center, Container, VStack } from '@styled-system/jsx'
import { particulesBg } from '@styled-system/patterns'

const HomePage = () => {
  const t = useTranslations()

  return (
    <VStack h="100vh" bgColor="secondary" className={particulesBg()}>
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
            <MemesList />
          </Box>
        </Container>
      </Center>
      <Footer />
    </VStack>
  )
}

export default HomePage
