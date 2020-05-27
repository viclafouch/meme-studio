import * as express from 'express'
import { param, body } from 'express-validator'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as path from 'path'
import * as sslRedirect from 'heroku-ssl-redirect'
import { Request, Response, NextFunction } from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { MemeController } from '@server/controllers/meme.controller'
import { TextController } from '@server/controllers/text.controller'
import HttpException from '@server/exceptions/HttpException'
import { IS_DEV } from '@shared/config'
import { validate, isShortIdValid, isMemeExists, isB64 } from '@server/vadidators'

const clientDir = '/dist/client'

export const handleError = (err: HttpException, req: Request, res: Response, next?: NextFunction): any => {
  const { status = 500, message } = err
  return res.status(status).json({
    status,
    message,
    success: false
  })
}

export const send = (res: Response, data: Record<string, any> | null = null, status = 200): Response =>
  res.status(status).json({
    ...(data && { data }),
    success: true
  })

class App {
  public app: express.Application
  public memeController: MemeController = new MemeController()
  public textController: TextController = new TextController()

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet())
    this.app.use(cookieParser())
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
    if (!IS_DEV) this.app.use(morgan('combined'))
    this.app.use(cors())
    if (process.env.PRERENDER_TOKEN)
      this.app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN).blacklisted(['.webp']))
  }

  private initializeRoutes(): void {
    if (process.env.USE_SSL) this.app.use(sslRedirect())
    this.app.post(
      '/memes',
      validate([body('page').isInt({ min: 1 }), body('search').optional().isString(), body('lang').optional().isString()]),
      this.memeController.index
    )
    this.app.post(
      '/memes/:id',
      validate([param('id').exists().isString().custom(isShortIdValid).custom(isMemeExists)]),
      this.memeController.show
    )
    this.app.post('/share', validate([body('image').custom(isB64)]), this.memeController.share)
    if (IS_DEV) {
      this.app.put(
        '/memes/:id',
        validate([body('texts').isArray(), param('id').exists().isString().custom(isShortIdValid).custom(isMemeExists)]),
        this.textController.update
      )
    } else {
      this.app.get('*.js', function (req, res, next) {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        res.set('Content-Type', 'text/javascript')
        next()
      })
      this.app.get('*.css', function (req, res, next) {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        res.set('Content-Type', 'text/css')
        next()
      })
      this.app.use(
        express.static(process.cwd() + clientDir, {
          maxAge: 31536000
        })
      )
      this.app.get('*', (req, res) => {
        res.sendFile(path.resolve(process.cwd() + clientDir, 'index.html'))
      })
    }
    this.app.route('*').all(function (req: Request, res: Response) {
      handleError(new HttpException(404, 'Not Found'), req, res)
    })
  }

  private initializeErrorHandling(): void {
    this.app.use(handleError)
  }
}

export const app = new App().app
