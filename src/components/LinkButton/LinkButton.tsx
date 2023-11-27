/* eslint-disable react/require-default-props */
import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import * as styles from '@components/Button/Button.styles'
import { cx } from '@styled-system/css'

export type LinkButtonProps = styles.ButtonVariants &
  LinkProps & {
    startAdornment?: React.ReactNode | null
    children: React.ReactNode | null
  }

const LinkButton = React.forwardRef(
  (
    {
      rounded,
      fullWidth,
      children,
      size,
      startAdornment = null,
      color,
      ...restAnchorProps
    }: LinkButtonProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const classes = styles.button({ rounded, fullWidth, color, size })

    return (
      <Link className={classes.root} ref={ref} {...restAnchorProps}>
        {startAdornment ? (
          <span className={cx(classes['start-adornment'], 'start-adornment')}>
            {startAdornment}
          </span>
        ) : null}
        {children}
      </Link>
    )
  }
)

export default LinkButton
