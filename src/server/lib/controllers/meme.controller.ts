import { Response, NextFunction, Request } from 'express'
import * as Twit from 'twit'
import { Op } from 'sequelize'
import Meme from '../models/meme.model'
import TextBox from '../models/textbox.model'
import { send } from '../config/app'
import twitterConfig from '@server/config/twitter'
import { IS_DEV } from '@shared/config'
import HttpException from '@server/exceptions/HttpException'
import Translation from '@server/models/translation.model'

export class MemeController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as Record<string, any>
      const { page, search, lang } = body
      const likely = !IS_DEV ? Op.iLike : Op.like

      const where = search
        ? {
            [Op.or]: [
              {
                name: {
                  [likely]: `%${search}%`
                }
              },
              {
                keywords: {
                  [likely]: `%${search}%`
                }
              }
            ],
            lang: lang || 'en'
          }
        : {
            lang: lang || 'en'
          }

      const { count } = await Meme.findAndCountAll({
        include: [
          {
            model: Translation,
            as: 'translations',
            where
          }
        ]
      })
      const memesPerPage = 10
      const pages = Math.ceil(count / memesPerPage)
      const offset = memesPerPage * (page - 1)
      const memes: Array<Meme> = await Meme.findAll<Meme>({
        limit: memesPerPage,
        include: [
          {
            model: Translation,
            as: 'translations',
            where
          }
        ],
        offset,
        order: [['createdAt', 'DESC']]
      })

      send(
        res,
        {
          pages,
          memes
        },
        200
      )
    } catch (error) {
      console.error(error)
      next(new HttpException(500))
    }
  }
  public async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.params as Record<string, any>
      const { id } = params
      const meme: Meme = await Meme.findByPk<Meme>(id, {
        include: [
          {
            model: Translation,
            as: 'translations'
          }
        ]
      })
      const texts: Array<TextBox> = await TextBox.findAll({
        where: {
          memeId: meme.id
        },
        attributes: {
          exclude: ['memeId']
        }
      })
      send(
        res,
        {
          meme,
          texts
        },
        200
      )
    } catch (error) {
      console.error(error)
      next(new HttpException(500))
    }
  }

  public async share(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as Record<string, any>
      const { image } = body

      let imageUrl: string

      if (!IS_DEV) {
        const T = new Twit(twitterConfig)

        const upload = (image64: string): Promise<any> =>
          new Promise((resolve: any, reject: any) =>
            T.post('media/upload', { media_data: image64 }, function (err, data) {
              if (err) reject(err)
              else resolve(data)
            })
          )

        const create = (mediaId: string): Promise<any> =>
          new Promise((resolve, reject) => {
            T.post('media/metadata/create', { media_id: mediaId }, function (err) {
              if (err) reject(err)
              else {
                const params = { media_ids: [mediaId] }
                T.post('statuses/update', params, function (err, data) {
                  if (err) reject(err)
                  else resolve(data)
                })
              }
            })
          })
        const data = await upload(image.split(',')[1])
        const mediaId = data.media_id_string
        const tweet = await create(mediaId)
        imageUrl = tweet.entities.media[0].display_url // pic.twitter.com/:id
      } else {
        imageUrl = 'pic.twitter.com/zTI4JZoShU'
      }

      send(
        res,
        {
          url: imageUrl
        },
        200
      )
    } catch (error) {
      console.error(error)
      next(new HttpException(500))
    }
  }
}
