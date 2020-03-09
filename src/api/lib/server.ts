import { app } from './config/app'
import { database } from './config/database'
import Meme from './models/meme.model'
import { TextBox } from './models/textbox.model'
import * as datas from '../memes.json'
import { MemeIJson } from '../memes.int'

const PORT = process.env.PORT || 3000

const memes: Array<MemeIJson> = datas.memes as Array<MemeIJson>

async function start(resetDb: boolean): Promise<void> {
  await database.sync({ force: resetDb })
  if (resetDb) {
    await Promise.all(
      memes.map(async meme => {
        const [uuid, ext] = meme.src.replace(/^.*[\\\/]/, '').split('.')
        const { id } = await Meme.create<Meme>({
          ...meme,
          uuid,
          ext
        })
        if (meme.texts) {
          for (const text of meme.texts) {
            await TextBox.create({
              ...text,
              memeId: id
            })
          }
        }
      })
    )
    console.log(`${memes.length} memes have been added!`)
  }
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))
}

export default start
