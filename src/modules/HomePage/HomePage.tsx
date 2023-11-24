'use client'

import Image from 'next/image'
import Footer from '@components/Footer/Footer'
import LinkButton from '@components/LinkButton'
import Page from '@components/Page/Page'
import { Meme } from '@models/Meme'
import { Flex } from '@styled-system/jsx'
import Styled from './HomePage.styled'

export type HomePageProps = {
  memes: Meme[]
}

const HomePage = ({ memes }: HomePageProps) => {
  return (
    <Page>
      <Flex
        align="center"
        direction="column"
        justify="center"
        marginTop="14"
        flex={1}
        textAlign="center"
      >
        <Image
          alt="Meme Studio logo"
          width={350}
          height={67}
          src="/images/logo-meme-studio.png"
        />
        <Styled.Caption>
          Create a meme from JPG or PNG images. Edit your image and make your
          custom meme.
        </Styled.Caption>
        <LinkButton href="/create">Get started</LinkButton>
        <Styled.MemesList>
          {memes.map((meme) => {
            return (
              <li key={meme.id}>
                <Styled.MemeArticle>
                  <Image
                    alt={meme.translations.en.name}
                    width={meme.width / 2}
                    height={meme.height / 2}
                    src={`https://www.meme-studio.io/templates/${meme.filename}`}
                  />
                </Styled.MemeArticle>
              </li>
            )
          })}
        </Styled.MemesList>
      </Flex>
      <Footer />
    </Page>
  )
}

export default HomePage
