import importsConfig from '@viclafouch/eslint-config-viclafouch/imports.mjs'
import baseConfig from '@viclafouch/eslint-config-viclafouch/index.mjs'
import nextConfig from '@viclafouch/eslint-config-viclafouch/next.mjs'
import prettierConfig from '@viclafouch/eslint-config-viclafouch/prettier.mjs'
import typescriptConfig from '@viclafouch/eslint-config-viclafouch/typescript.mjs'

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  ...baseConfig,
  ...nextConfig,
  ...importsConfig,
  ...typescriptConfig,
  ...prettierConfig,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/styled-system/**'
    ]
  }
  // {
  //   'react-hooks/exhaustive-deps': [
  //     'error',
  //     {
  //       AdditionalHooks: 'useIsomorphicLayoutEffect'
  //     }
  //   ],
  //   'no-restricted-imports': [
  //     'error',
  //     {
  //       Paths: [
  //         {
  //           Name: 'next/link',
  //           Message: 'Please use i18n Link from @i18n/navigation'
  //         },
  //         {
  //           Name: 'next/navigation',
  //           ImportNames: ['redirect'],
  //           Message: 'Please use redirect function from @i18n/navigation'
  //         }
  //       ]
  //     }
  //   ]
  // }
]
