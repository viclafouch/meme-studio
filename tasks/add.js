const yargs = require('yargs')
const path = require('path')
const fs = require('fs')
const { getCurrentMemes, setCurrentMemes, createMeme, convertToWebP, templateDir } = require('./helpers')

let args = yargs
  .option('url', {
    alias: 'u',
    description: 'Path or link of the image meme',
    demand: true
  })
  .option('name', {
    alias: 'n',
    description: 'Name of the meme',
    demand: true
  })
  .option('keywords', {
    alias: 'k',
    description: 'Keywords EN of the meme',
    default: '',
    demand: false
  })
  .check(argv => {
    let url
    try {
      url = new URL(argv.u)
    } catch (_) {
      try {
        fs.existsSync(argv.v)
        url = argv.v
        return true
      } catch (error) {
        throw new Error('Url argument must be a valid URL')
      }
    }
    if (!url.href.endsWith('.jpg') || !url.href.endsWith('.png')) throw new Error("url must ends with '.jpg' or 'png'")
    return true
  }).argv

async function insertMeme({ name, url, keywords }) {
  const jsonData = await getCurrentMemes()
  const createdMeme = await createMeme({
    url,
    keywords,
    memeName: name,
    boxCount: 0
  })
  jsonData.memes.push(createdMeme)
  const filePath = path.join(templateDir, createdMeme.filename)
  const webpFile = filePath.replace('.jpg', '.webp')
  console.log('Convertion to WebP...')
  await convertToWebP(filePath, webpFile)
  console.info('A meme has been created : \n', createdMeme)
  await setCurrentMemes(jsonData)
}

insertMeme({
  name: args.name,
  url: args.url,
  keywords: args.keywords
})
