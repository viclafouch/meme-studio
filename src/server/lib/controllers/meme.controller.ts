import { Response, NextFunction } from 'express'
import Meme from '../models/meme.model'
import TextBox from '../models/textbox.model'
import MemeNotFoundException from '../exceptions/MemeNotFoundException'
import { send } from '../config/app'
import * as Twit from 'twit'
import {
  ReqMemeShowInt,
  ResultMemeShowInt,
  ResultMemeIndex,
  ReqMemeIndex,
  ReqShareToTwitter,
  ResultShareToTwitter,
} from '../interfaces/meme.interface'
import twitterConfig from '@server/config/twitter'
import { IS_DEV } from '@shared/config'
import HttpException from '@server/exceptions/HttpException'

export class MemeController {
  public async index(req: ReqMemeIndex, res: Response): Promise<void> {
    const limit = 10
    const { page } = req.body
    let numPage: number = parseInt(page, 10)
    numPage = !isNaN(numPage) ? numPage : 1
    const { count } = await Meme.findAndCountAll()
    const pages: number = Math.ceil(count / limit)
    const offset: number = limit * (numPage - 1)
    const memes: Array<Meme> = await Meme.findAll<Meme>({ raw: true, limit, offset, order: [['id', 'ASC']] })
    const result: ResultMemeIndex = {
      memes,
      pages,
    }
    send(res, result)
  }
  public async show(req: ReqMemeShowInt, res: Response, next: NextFunction): Promise<void> {
    const id: string = req.params.id
    const meme: Meme | null = await Meme.findByPk<Meme>(id, {
      raw: true,
    })
    if (meme) {
      const texts: Array<TextBox> = await TextBox.findAll({
        raw: true,
        where: {
          memeId: meme.id,
        },
        attributes: {
          exclude: ['memeId'],
        },
      })

      const result: ResultMemeShowInt = {
        meme,
        texts,
      }

      send(res, result)
    } else next(new MemeNotFoundException(id))
  }

  public async share(req: ReqShareToTwitter, res: Response, next: NextFunction): Promise<void> {
    try {
      const image: string = req.body.image
      console.log(twitterConfig)

      const T = new Twit(twitterConfig)

      const upload = (image64: string): Promise<any> =>
        new Promise((resolve: any, reject: any) =>
          // eslint-disable-next-line @typescript-eslint/camelcase
          T.post('media/upload', { media_data: image64 }, function (err, data: any) {
            if (err) reject(err)
            else resolve(data)
          })
        )

      const data = await upload(image.split(',')[1])

      const create = (mediaId: string): Promise<any> =>
        new Promise((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/camelcase
          T.post('media/metadata/create', { media_id: mediaId }, function (err) {
            if (err) reject(err)
            else {
              // eslint-disable-next-line @typescript-eslint/camelcase
              const params = { media_ids: [mediaId] }
              T.post('statuses/update', params, function (err, data) {
                if (err) reject(err)
                else resolve(data)
              })
            }
          })
        })

      let imageUrl

      if (!IS_DEV) {
        const mediaId = data.media_id_string
        const tweet = await create(mediaId)
        imageUrl = tweet.entities.media[0].display_url // pic.twitter.com/:id
      } else {
        imageUrl = 'pic.twitter.com/zTI4JZoShU'
      }

      const result: ResultShareToTwitter = {
        url: imageUrl,
      }
      send(res, result)
    } catch (error) {
      console.error(error)
      next(new HttpException(500))
    }
  }
}
