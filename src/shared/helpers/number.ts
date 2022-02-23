import * as R from 'ramda'

export const degreeToRad = R.pipe(R.multiply(Math.PI), R.divide(180))
