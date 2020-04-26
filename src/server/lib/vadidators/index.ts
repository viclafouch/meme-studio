import { validationResult, Result, ValidationError, ValidationChain } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const validate = (validations: Array<ValidationChain>) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  await Promise.all(validations.map((validation: ValidationChain) => validation.run(req)))
  const errors: Result<ValidationError> = validationResult(req)

  if (errors.isEmpty()) return next()

  const extractedErrors: Array<object> = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  const status = 422

  return res.status(status).json({
    status,
    message: extractedErrors,
    success: false
  })
}
