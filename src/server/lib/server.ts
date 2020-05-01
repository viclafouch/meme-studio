import { app } from './config/app'
import database from './config/database'
import Meme from './models/meme.model'
import TextBox from './models/textbox.model'
import * as datas from '../memes.json'
import { IS_DEV, PORT_SERVER_DEV, PORT_SERVER_PROD } from '../../shared/config'

const PORT = IS_DEV ? PORT_SERVER_DEV : PORT_SERVER_PROD

const memes: Array<any> = datas.memes

async function start(): Promise<void> {
  await database.sync({ force: true })
  await Promise.all(
    memes.map(async meme => {
      const { id } = await Meme.create<Meme>({
        ...meme,
        createdAt: new Date(meme.createdAt),
        updatedAt: new Date(meme.updatedAt)
      })
      for (const text of meme.texts) {
        await TextBox.create({
          ...text,
          memeId: id
        })
      }
    })
  )
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}! \nisDev: ${IS_DEV}`))
}

export default start
