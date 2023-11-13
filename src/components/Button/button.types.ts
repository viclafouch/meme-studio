export type ButtonSizes = 'small' | 'medium' | 'large'

export type BaseButtonProps = {
  rounded?: boolean
  fullWidth?: boolean
  color?: 'primary' | 'secondary'
  startAdornment?: React.ReactNode
}
