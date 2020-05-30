import * as React from 'react'
import Header from '@client/components/Header/Header'
import Footer from '@client/components/Footer/Footer'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import '@client/scss/pages/about.scss'

function About(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="page about">
      <Header />
      <div className="content-one">
        <section className="about-body container">
          <h1>{t('about.meta.title')}</h1>
          <p>{t('about.text1')}</p>
          <p>{t('about.text2')}</p>
          <p>
            <Trans i18nKey="about.contactMe">
              If you have any suggestions, comments, or if you'd like to report a bug, please use the
              <a rel="noreferrer noopener" href="https://forms.gle/KT2wHbobQwKLXDo1A" target="blank">
                feedback form
              </a>
              . If you want an image removed, please contact me:
            </Trans>{' '}
            <a rel="noreferrer noopener" target="_blank" id="contact-me" href="mailto:contact@meme-studio.io">
              contact@meme-studio.io
            </a>
          </p>
          <p>
            {t('about.contactTwitter')}{' '}
            <a rel="noreferrer noopener" href="https://twitter.com/TrustedSheriff" target="_blank" title="@TrustedSheriff">
              https://twitter.com/TrustedSheriff
            </a>
          </p>
          <p>
            {t('about.openSource')}{' '}
            <a rel="noreferrer noopener" href="https://github.com/viclafouch/meme-studio" target="_blank">
              https://github.com/viclafouch/meme-studio
            </a>
          </p>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=viclafouch&repo=meme-studio&type=star&count=true"
            frameBorder="0"
            scrolling="0"
            width="90px"
            height="20px"
          ></iframe>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=viclafouch&type=follow&count=true"
            frameBorder="0"
            scrolling="0"
            width="170px"
            height="20px"
          ></iframe>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default About
