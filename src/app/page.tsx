import { redirect } from '@i18n/navigation'

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  redirect({
    href: '/',
    locale: 'fr'
  })
}
