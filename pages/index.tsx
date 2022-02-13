import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from 'next'
import HomePage from 'modules/HomePage/HomePage'

import memesData from './api/meme.json'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      memes: memesData.memes.slice(0, 3)
    }
  }
}

const Home: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <HomePage {...props} />
}

export default Home
