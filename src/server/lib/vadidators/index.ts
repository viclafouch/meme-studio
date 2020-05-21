import * as isBase64 from 'is-base64'
import * as shortid from 'shortid'
import { validationResult, Result, ValidationError, ValidationChain } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import Meme from '@server/models/meme.model'

export const validate = (validations: Array<ValidationChain>) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  await Promise.all(validations.map((validation: ValidationChain) => validation.run(req)))
  const errors: Result<ValidationError> = validationResult(req)

  if (errors.isEmpty()) return next()

  const extractedErrors: Array<Record<string, any>> = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  const status = 422

  return res.status(status).json({
    status,
    message: extractedErrors,
    success: false
  })
}

export const isShortIdValid = (id: string): Promise<void> => {
  if (!shortid.isValid(id)) return Promise.reject('field is not valid')
  else return Promise.resolve()
}

export const isMemeExists = async (id: string): Promise<void> => {
  const meme: Meme | null = await Meme.findByPk<Meme>(id)
  if (meme) return Promise.resolve()
  else return Promise.reject('Meme does not exist')
}

export const isB64 = (str: string): Promise<void> => {
  if (isBase64(str, { allowMime: true })) return Promise.resolve()
  else return Promise.reject('field is not valid')
}
