'use client'

import React from 'react'
import Error from 'next/error'

const NotFound = () => {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  )
}

export default NotFound
