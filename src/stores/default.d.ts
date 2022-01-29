type ThemeValue = 'dark' | 'light'

type DefaultState = {
  theme: ThemeValue
}

type ToggleTheme = {
  type: 'TOGGLE_THEME'
}

type DefaultActions = ToggleTheme
