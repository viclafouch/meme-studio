import database from './lib/config/database'
import Meme from './lib/models/meme.model'
import TextBox from './lib/models/textbox.model'
import Translation from './lib/models/translation.model'
import start from './lib/server'

async function insertTranslations(meme: Record<string, any>) {
  const promisesLang: Array<Promise<Translation>> = []
  Object.keys(meme.translations).forEach(lang => {
    const getKeyValue = <T extends Record<string, any>, U extends keyof T>(key: U) => (obj: T) => obj[key]
    const element = getKeyValue(lang)(meme.translations)
    promisesLang.push(
      Translation.create({
        lang,
        name: element.name,
        keywords: element.keywords,
        memeId: meme.id
      })
    )
  })
  await Promise.all(promisesLang)
}

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
          await Promise.all(
            meme.texts.map((text: Record<string, any>) =>
              TextBox.create({
                ...text,
                memeId: meme.id
              })
            )
          )
          await insertTranslations(meme)
        } else {
          await Meme.update(meme, { where: { id: meme.id } })
          await TextBox.destroy({ where: { memeId: meme.id } })
          await Translation.destroy({ where: { memeId: meme.id } })
          await Promise.all(
            meme.texts.map((text: Record<string, any>) =>
              TextBox.create({
                ...text,
                memeId: meme.id
              })
            )
          )
          await insertTranslations(meme)
        }
      })
    ).then(start)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
