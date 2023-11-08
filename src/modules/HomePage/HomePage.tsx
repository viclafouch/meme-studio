import Image from 'next/image'
import Link from 'next/link'
import Footer from '@components/Footer/Footer'
import Page from '@components/Page/Page'
import { Meme } from '@models/Meme'
import Styled from './home-page.styled'

type HomePageProps = {
  memes: Meme[]
}

const HomePage = (props: HomePageProps) => {
  const { memes } = props

  return (
    <Page animatedBackground>
      <Styled.ContentBlock>
        <Image
          alt="Meme Studio logo"
          width={350}
          height={67}
          layout="fixed"
          src="/images/logo-meme-studio.png"
        />
        <Styled.Caption>
          Create a meme from JPG or PNG images. Edit your image and make your
          custom meme.
        </Styled.Caption>
        <Link href="/create" passHref>
          <Styled.Link forwardedAs="a">Get started</Styled.Link>
        </Link>
        <Styled.MemesList>
          {memes.map((meme) => {
            return (
              <li key={meme.id}>
                <Styled.MemeArticle>
                  <Image
                    alt={meme.translations.en.name}
                    width={meme.width}
                    height={meme.height}
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
