import { app } from './config/app'
import { database } from './config/database'
import Meme from './models/meme.model'
import { TextBox } from './models/textbox.model'
import * as datas from '../memes.json'
import { MemeIJson } from '../memes.int'
import { IS_DEV, PORT_API_DEV, PORT_ALL_PROD } from '../../shared/config'

const PORT = IS_DEV ? PORT_API_DEV : PORT_ALL_PROD

const memes: Array<MemeIJson> = datas.memes as Array<MemeIJson>

async function start(resetDb: boolean): Promise<void> {
  await database.sync({ force: resetDb })
  if (resetDb) {
    await Promise.all(
      memes.map(async (meme) => {
        const { id } = await Meme.create<Meme>(meme)
        for (const text of meme.texts) {
          await TextBox.create({
            ...text,
            memeId: id,
          })
        }
      })
    )
    console.log(`${memes.length} memes have been added to db!`)
  }
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}! \nisDev: ${IS_DEV}`))
}

export default start
