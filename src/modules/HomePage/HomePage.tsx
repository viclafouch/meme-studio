import Image from 'next/image'
import Footer from '@components/Footer/Footer'
import Page from '@components/Page/Page'
import { Meme } from '@models/Meme'
import Styled from './HomePage.styled'

export type HomePageProps = {
  memes: Meme[]
}

const HomePage = ({ memes }: HomePageProps) => {
  return (
    <Page animatedBackground>
      <Styled.ContentBlock>
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
        <Styled.Link href="/create">Get started</Styled.Link>
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
      </Styled.ContentBlock>
      <Footer />
    </Page>
  )
}

export default HomePage
