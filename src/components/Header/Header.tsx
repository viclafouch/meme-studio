import React from 'react'
import Image from 'next/image'
import ExportButton from '@components/Header/ExportButton'
import LocaleSelector from '@components/LocaleSelector'
import { Link } from '@i18n/navigation'
import { Box, Flex, Grid } from '@styled-system/jsx'

const Header = () => {
  return (
    <Grid
      height="5rem"
      width="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bgColor="primary.dark"
      zIndex={999}
      paddingInline="12"
      boxShadow="md"
      gridTemplateColumns="1fr auto 1fr"
    >
      <div />
      <Box py="1.5">
        <Link href="/">
          <Image
            alt="Meme Studio logo"
            width={250}
            height={67}
            priority
            src="/images/logo-meme-studio-light.png"
          />
        </Link>
      </Box>
      <Flex align="center" justify="flex-end" gap={5}>
        <LocaleSelector />
        <ExportButton />
      </Flex>
    </Grid>
  )
}

export default Header
