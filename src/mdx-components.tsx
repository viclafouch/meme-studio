import type { MDXComponents } from 'mdx/types'
import { css } from '@styled-system/css'

// This file is required to use @next/mdx in the `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => {
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h1 className={css({ fontSize: 'xx-large' })} {...props} />
    },
    h2: (props) => {
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h2 className={css({ fontSize: 'x-large' })} {...props} />
    },
    a: (props) => {
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a className={css({ color: 'primary' })} {...props} />
    },
    ...components
  }
  // Allows customizing built-in components, e.g. to add styling.
  // Return {
  //   H1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
  //   ...components,
  // }
}
