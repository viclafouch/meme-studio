import type { NextPage } from 'next'
import HomePage from 'modules/HomePage'
import { Meme } from '@models/Meme'
import memesData from '@shared/api/meme.json'

export const getServerSideProps = () => {
  return {
    props: {
      memes: memesData.memes.slice(0, 3)
    }
  }
}

const Home: NextPage<{ memes: Meme[] }> = (props) => {
  return <HomePage {...props} />
}

export default Home
