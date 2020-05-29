import * as fs from 'fs'
import * as path from 'path'
import { Request, Response, NextFunction } from 'express'
import HttpException from '@server/exceptions/HttpException'
import TextBox from '@server/models/textbox.model'
import { send } from '@server/config/app'
import * as datas from '../../memes.json'

export class TextController {
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memeId = req.params.id
      const texts = req.body.texts
      await TextBox.destroy({ where: { memeId } })

      await Promise.all(
        texts.map((text: any) =>
          TextBox.create({
            ...text,
            memeId
          })
        )
      )

      const memes = datas.memes
      const index = memes.findIndex(meme => meme.id === memeId)

      if (index !== -1) {
        const meme: Record<string, any> = datas.memes[index]
        const texts = await TextBox.findAll({
          where: { memeId }
        })
        meme.texts = texts.map(text => {
          const t = text.get({ plain: true }) as Record<string, any>
          delete t.memeId
          return t
        })
      }

      const textResult = JSON.stringify(datas, null, 2)
      await fs.promises.writeFile(path.resolve('src', 'server', 'memes.json'), textResult)
      send(res, null, 200)
    } catch (error) {
      console.error(error)
      next(new HttpException(500))
    }
  }
}
