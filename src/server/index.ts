import database from './lib/config/database'
import Meme from './lib/models/meme.model'
import TextBox from './lib/models/textbox.model'
import start from './lib/server'

//
;(async (): Promise<void> => {
  try {
    console.log('Authentication to the database...')
    await database.authenticate()
    const { memes } = await import('./memes.json')
    console.log('Synchronisation with the database...')
    await database.sync()

    Promise.all(
      memes.map(async meme => {
        const existedMeme = await Meme.findByPk(meme.id)
        if (!existedMeme) {
          await Meme.create<Meme>(meme)
          await Promise.all(meme.texts.map(text => TextBox.create(text)))
        } else {
          await Meme.update(meme, { where: { id: meme.id } })
          await TextBox.destroy({ where: { memeId: meme.id } })
          await Promise.all(meme.texts.map(async text => TextBox.create(text)))
        }
      })
    ).then(start)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
