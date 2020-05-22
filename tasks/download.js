const fs = require('fs')
const path = require('path')
const request = require('request')
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
const { getCurrentMemes, setCurrentMemes, createMeme, downloadAndCompress, convertToWebP, templateDir } = require('./helpers')

;(async () => {
  const jsonData = await getCurrentMemes()
  request(
    {
      url: 'https://api.imgflip.com/get_memes',
      json: true
    },
    async function (_, _, body) {
      let nbNewMemes = 0
      if (!body.success) throw new Error('Something wrong happened with imgflip!')
      for (const meme of body.data.memes) {
        const index = jsonData.memes.findIndex(m => meme.name === m.name)
        if (index === -1) {
          const createdMeme = await createMeme({
            url: meme.url,
            memeName: meme.name,
            boxCount: meme.box_count
          })
          jsonData.memes.push(createdMeme)
          nbNewMemes++
        } else {
          const templatePath = path.join(templateDir, jsonData.memes[index].filename)
          if (!fs.existsSync(templatePath)) await downloadAndCompress(meme.url, templatePath)
          const dimensions = await sizeOf(templatePath)
          jsonData.memes[index].height = dimensions.height
          jsonData.memes[index].width = dimensions.width
        }
      }

      await setCurrentMemes(jsonData)
      console.log(`${nbNewMemes} memes have been added`)
    }
  )

  for (const meme of jsonData.memes) {
    const filePath = path.join(templateDir, meme.filename)
    const webpFile = filePath.replace('.jpg', '.webp')
    if (!fs.existsSync(webpFile)) {
      console.log('Convertion to WebP...')
      await convertToWebP(filePath, webpFile)
    }
  }
})()
