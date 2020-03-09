import { Response, NextFunction } from 'express'
import Meme from '../models/meme.model'
import TextBox from '../models/textbox.model'
import MemeNotFoundException from '../exceptions/MemeNotFoundException'
import { send } from '../config/app'
import { ReqMemeShowInt, ResultMemeShowInt, ResultMemeIndex, ReqMemeIndex } from '../interfaces/meme.interface'

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
      pages
    }
    send(res, result)
  }
  public async show(req: ReqMemeShowInt, res: Response, next: NextFunction): Promise<void> {
    const id: string = req.params.id
    const meme: Meme | null = await Meme.findByPk<Meme>(id, {
      raw: true
    })
    if (meme) {
      const texts: Array<TextBox> = await TextBox.findAll({
        raw: true,
        where: {
          memeId: meme.id
        },
        attributes: {
          exclude: ['memeId']
        }
      })

      const result: ResultMemeShowInt = {
        meme,
        texts
      }

      send(res, result)
    } else next(new MemeNotFoundException(id))
  }
}
