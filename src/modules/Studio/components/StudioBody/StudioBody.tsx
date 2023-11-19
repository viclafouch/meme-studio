import React from 'react'
import * as R from 'remeda'
import { useTextboxes } from '@stores/Editor/hooks/useTextboxes'
import Aside from '@studio/components/Aside'
import Canvas from '@studio/components/Canvas'
import MemeContainer from '@studio/components/MemeContainer'
import Tools from '@studio/components/Tools'
import Styled from './StudioBody.styled'

const StudioBody = () => {
  const { textboxes } = useTextboxes()

  const textboxRefs = React.useMemo(() => {
    return R.mapToObj(textboxes, (textbox) => {
      return [String(textbox.id), React.createRef<HTMLTextAreaElement>()]
    })
  }, [textboxes])

  return (
    <Styled.Studio>
      <Tools />
      <Styled.DefaultContainer>
        <MemeContainer>
          <Canvas />
        </MemeContainer>
      </Styled.DefaultContainer>
      <Aside textboxRefs={textboxRefs} />
    </Styled.Studio>
  )
}

export default StudioBody
