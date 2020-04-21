import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getDefaultLang } from '@client/utils/index'

export const languages = {
  fr: {
    name: 'Francais',
    flag: '/images/flag-fr.svg',
    translation: require('../../locales/fr/translation.json')
  },
  en: {
    name: 'English',
    flag: '/images/flag-en.svg',
    translation: require('../../locales/en-US/translation.json')
  }
}

const fallbackLng = 'en'
const lng = i18n.language || window.localStorage.i18nextLng || getDefaultLang(Object.keys(languages), fallbackLng)

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: languages,
    lng,
    fallbackLng,
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n
