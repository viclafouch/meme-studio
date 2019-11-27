import * as React from 'react'
import { memo } from 'react'
import Meme from '@shared/models/Meme'
import './customization.scss'

type CustomizationProps = {
  memeSelected: Meme | null
}

function Customization({ memeSelected }: CustomizationProps): JSX.Element {
  return (
    <div>
      <h2>Edit {memeSelected ? memeSelected.name : ''}</h2>
    </div>
  )
}

export default memo(Customization)
