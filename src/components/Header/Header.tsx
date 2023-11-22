import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ExportButton from '@components/Header/ExportButton'
import { Flex, Grid } from '@styled-system/jsx'

const Header = () => {
  return (
    <Grid
      height="5rem"
      width="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bg="primary"
      zIndex={999}
      paddingInline="12"
      boxShadow="md"
      gridTemplateColumns="1fr auto 1fr"
    >
      <div />
      <div>
        <Link href="/">
          <Image
            alt="Meme Studio logo"
            width={250}
            height={67}
            priority
            src="/images/logo-meme-studio-light.png"
          />
        </Link>
      </div>
      <Flex align="center" justify="flex-end">
        <ExportButton />
      </Flex>
    </Grid>
  )
}

export default Header
