import React from 'react'
import CreatePage from 'modules/Studio'

const metadata = {
  default: 'Create a meme',
  description:
    'Create a meme from JPG or PNG images or from your own image. Edit it and make your custom meme!'
}

const Page = () => {
  return <CreatePage />
}

export { metadata }

export default Page
