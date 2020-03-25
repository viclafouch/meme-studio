import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import { Request, Response, NextFunction } from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { MemeController } from '@server/controllers/meme.controller'
import HttpException from '@server/exceptions/HttpException'
import { IS_DEV } from '@shared/config'

const clientDir = '/dist/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (err: HttpException, req: Request, res: Response, next?: NextFunction): void => {
  const { status, message } = err
  res.status(status).json({
    status,
    message,
    success: false,
  })
}

export const send = (res: Response, data: object, status = 200): Response =>
  res.status(status).json({
    data,
    success: true,
  })

class App {
  public app: express.Application
  public memeController: MemeController = new MemeController()

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet())
    this.app.use(cookieParser())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(morgan('combined'))
    if (!IS_DEV) this.app.use(express.static(process.cwd() + clientDir))
    this.app.use(cors())
  }

  private initializeRoutes(): void {
    this.app.route('/memes').post(this.memeController.index)
    this.app.route('/memes/:id').post(this.memeController.show)
    this.app.route('/status').get(function (req: Request, res: Response) {
      send(res, {})
    })
    this.app.route('*').all(function (req: Request, res: Response) {
      handleError(new HttpException(404, 'Not Found'), req, res)
    })
  }

  private initializeErrorHandling(): void {
    this.app.use(handleError)
  }
}

export const app = new App().app
