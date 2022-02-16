import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { getMeme } from '@shared/api/memes'

import Aside from './components/Aside/Aside'
import EmptyContainer from './components/EmptyContainer/EmptyContainer'
import MemeContainer from './components/MemeContainer/MemeContainer'
import Tools from './components/Tools/Tools'
import Styled from './studio.styled'

const CreatePage = () => {
  const router = useRouter()
  const { data: meme } = useQuery(
    ['memes', router.query.memeId],
    () => {
      return getMeme(router.query.memeId as Meme['id'])
    },
    {
      enabled: Boolean(router.query.memeId)
    }
  )

  return (
    <Styled.Page>
      <Header />
      <Styled.Studio>
        <Tools />
        <Styled.DefaultContainer>
          {meme ? <MemeContainer meme={meme} /> : <EmptyContainer />}
        </Styled.DefaultContainer>
        <Aside />
      </Styled.Studio>
    </Styled.Page>
  )
}

CreatePage.defaultProps = {
  meme: null
}

export default CreatePage
