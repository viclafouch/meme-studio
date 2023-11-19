import React from 'react'
import { DefaultSeo as NextDefaultSeo } from 'next-seo'

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      themeColor="dark light"
      additionalLinkTags={[
        {
          rel: 'icon',
          href: '/favicon.png'
        }
      ]}
    />
  )
}

export default DefaultSeo
