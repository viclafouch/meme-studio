import React from 'react'
import Image from 'next/image'
import { Link } from '@i18n/navigation'
import { Box, Flex, Grid } from '@styled-system/jsx'

export type HeaderProps = {
  actions?: React.ReactNode
}

const Header = ({ actions = null }: HeaderProps) => {
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
            src="/images/logo-meme-studio-dark.png"
          />
        </Link>
      </Box>
      <Flex align="center" justify="flex-end" gap={5}>
        {actions}
      </Flex>
    </Grid>
  )
}

export default Header
