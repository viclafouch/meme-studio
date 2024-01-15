import React from 'react'
import Image from 'next/image'
import GithubIcon from '@components/icons/Github'
import { Link } from '@i18n/navigation'
import { Box, Flex, Grid } from '@styled-system/jsx'
import { Bubble } from './Header.styles'

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
      <Box position="relative" height="full">
        <Box display={{ mdDown: 'none' }}>
          <Bubble
            target="_blank"
            href="https://github.com/viclafouch/meme-studio"
            className="github-corner"
            aria-label="View source on GitHub"
            title="View source on GitHub"
            rel="noreferrer noopener"
          >
            <GithubIcon />
          </Bubble>
        </Box>
      </Box>
      <Box py="1.5">
        <Link href="/">
          <Image
            alt="Meme Studio logo"
            width={250}
            height={48}
            priority
            src="/images/logo-meme-studio-dark.png"
          />
        </Link>
      </Box>
      <Flex
        align="center"
        justify="flex-end"
        gap={5}
        display={{ mdDown: 'none', md: 'flex' }}
      >
        {actions}
      </Flex>
    </Grid>
  )
}

export default Header
