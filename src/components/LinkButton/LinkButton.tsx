/* eslint-disable react/require-default-props */
import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import * as styles from '@components/Button/Button.styles'

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
      startAdornment = null,
      color,
      ...restAnchorProps
    }: LinkButtonProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <Link
        className={styles.button({ color, rounded, fullWidth })}
        ref={ref}
        {...restAnchorProps}
      >
        {startAdornment ? (
          <span className="button-start-adornment">{startAdornment}</span>
        ) : null}
        {children}
      </Link>
    )
  }
)

export default LinkButton
