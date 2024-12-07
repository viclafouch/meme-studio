'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import FlagEn from '@components/LocaleSelector/flags/en'
import FlagFr from '@components/LocaleSelector/flags/fr'
import { Link, usePathname } from '@i18n/navigation'
import { css } from '@styled-system/css'
import { Box, VStack } from '@styled-system/jsx'
import type { Locales } from '@viclafouch/meme-studio-utilities/constants'

const FlagByLocale = {
  en: FlagEn,
  fr: FlagFr
} as const satisfies { [key in Locales]: React.ElementType }

const LocaleSelector = () => {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = useLocale() as Locales
  const [isActive, setIsActive] = React.useState<boolean>(false)

  const handleClose = (event: MouseEvent) => {
    event.preventDefault()
    setIsActive(false)
  }

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsActive(true)
  }

  React.useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handleClose, false)
    }

    return () => {
      document.removeEventListener('click', handleClose, false)
    }
  }, [isActive])

  const localesList: {
    [key in Locales]: string
  } = {
    en: t('common.english'),
    fr: t('common.french')
  }

  const CurrentFlagComponent = FlagByLocale[locale]

  return (
    <Box position="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label={t('common.switchLang')}
        className={css({
          cursor: 'pointer',
          p: 1,
          backgroundColor: 'transparent'
        })}
      >
        <CurrentFlagComponent width={22} height={22} />
      </button>
      {isActive ? (
        <Box
          position="absolute"
          minWidth={88}
          borderRadius={4}
          overflow="hidden"
          zIndex={9999999}
          top="100%"
          right={0}
          boxShadow="2px 8px 16px 2px rgba(0,0,0,.4)"
          textAlign="left"
        >
          <VStack gap={0} width="100%">
            {Object.keys(localesList).map((localeKey: string) => {
              return (
                <Link
                  href={pathname}
                  locale={localeKey as Locales}
                  key={localeKey}
                  replace
                  className={css({
                    p: 2,
                    bgColor: 'secondary',
                    width: '100%',
                    _hover: {
                      bgColor: 'secondary.light'
                    }
                  })}
                >
                  {localesList[localeKey as keyof typeof localesList]}
                </Link>
              )
            })}
          </VStack>
        </Box>
      ) : null}
    </Box>
  )
}

export default LocaleSelector
