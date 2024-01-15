// Use type safe message keys with `next-intl`

type Messages = (typeof import('./locales/en'))['default']

declare interface IntlMessages extends Messages {}
