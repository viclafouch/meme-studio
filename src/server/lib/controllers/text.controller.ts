import { Request, Response, NextFunction } from 'express'
import HttpException from '@server/exceptions/HttpException'
import TextBox from '@server/models/textbox.model'
import { TextBoxIJson } from '@src/server/memes.int'
import { send } from '@server/config/app'
export class TextController {
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memeId = req.params.id
      const texts: Array<TextBoxIJson> = req.body.texts as Array<TextBoxIJson>
      await TextBox.destroy({ where: { memeId } })
      await Promise.all(
        texts.map(text =>
          TextBox.create({
            ...text,
            memeId
          })
        )
      )
      send(res, null, 200)
    } catch (error) {
      console.error(error)
      next(new HttpException(500))
    }
  }
}
