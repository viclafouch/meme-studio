/* eslint-disable react/require-default-props */
import * as React from 'react'
import { cx } from '@styled-system/css'
import * as styles from './Button.styles'

export type ButtonProps = styles.ButtonVariants &
  React.ComponentPropsWithoutRef<'button'> & {
    startAdornment?: React.ReactNode | null
  }

const Button = React.forwardRef(
  (
    {
      children,
      startAdornment = null,
      color,
      rounded,
      fullWidth,
      size,
      className,
      ...restButtonProps
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const classes = styles.button({ rounded, fullWidth, color, size })

    return (
      <button
        ref={ref}
        type="button"
        className={cx(classes.root, className)}
        {...restButtonProps}
      >
        {startAdornment ? (
          <span className={cx(classes['start-adornment'], 'start-adornment')}>
            {startAdornment}
          </span>
        ) : null}
        {children}
      </button>
    )
  }
)

export default Button
