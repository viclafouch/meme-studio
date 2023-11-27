import Image from 'next/image'
import Footer from '@components/Footer'
import LinkButton from '@components/LinkButton'
import MemesList from '@components/MemesList'
import { css } from '@styled-system/css'
import { Box, Center, Container, VStack } from '@styled-system/jsx'
import { particulesBg } from '@styled-system/patterns'

const HomePage = () => {
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
            Create a meme from JPG or PNG images. Edit your image and make your
            custom meme.
          </p>
          <LinkButton color="primaryDark" size="large" rounded href="/create">
            Get started
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
