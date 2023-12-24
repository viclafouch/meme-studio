/* eslint-disable react/require-default-props */
import * as React from 'react'
import * as styles from '@components/Button/Button.styles'
import { Link, LinkProps } from '@i18n/navigation'
import { cx } from '@styled-system/css'

export type LinkButtonProps = styles.ButtonVariants &
  LinkProps & {
    startAdornment?: React.ReactNode | null
    children: React.ReactNode | null
    download?: string
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
      download,
      ...restAnchorProps
    }: LinkButtonProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const classes = styles.button({ rounded, fullWidth, color, size })

    const child = (
      <>
        {startAdornment ? (
          <span className={cx(classes['start-adornment'], 'start-adornment')}>
            {startAdornment}
          </span>
        ) : null}
        {children}
      </>
    )

    if (download) {
      return (
        <a
          className={classes.root}
          ref={ref}
          download={download}
          href={restAnchorProps.href.toString()}
        >
          {child}
        </a>
      )
    }

    return (
      <Link className={classes.root} ref={ref} {...restAnchorProps}>
        {child}
      </Link>
    )
  }
)

export default LinkButton
