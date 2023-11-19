import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    // highlight-next-line
    const sheet = new ServerStyleSheet()
    const originalRenderPage = context.renderPage

    try {
      const initialProps = await Document.getInitialProps({
        ...context,
        renderPage: () => {
          return originalRenderPage({
            enhanceApp: (App) => {
              return (props) => {
                return sheet.collectStyles(<App {...props} />)
              }
            }
          })
        }
      })

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Alata&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
