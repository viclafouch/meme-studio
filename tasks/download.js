const fs = require('fs')
const path = require('path')
const shortid = require('shortid')
const request = require('request')
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
const tinify = require('tinify')

if (!process.env.TINY_KEY) {
  throw new Error('Please provide a TINY_KEY from https://tinypng.com/developers')
}

tinify.key = process.env.TINY_KEY

const useCompression = true

const memeFile = path.resolve('src', 'server', 'memes.json')
const templateDir = './static/templates'

const downloadAndCompress = async (uri, filename) => {
  await new Promise((resolve, reject) => {
    request.head(uri, function (err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve)
    })
  })

  if (useCompression) {
    const source = tinify.fromFile(filename);
    console.log(`Compressing ${filename}...`);
    await source.toFile(filename);
  }
}

fs.existsSync(memeFile) || fs.writeFileSync(memeFile, JSON.stringify({ memes: [] }, null, 2))
fs.existsSync(templateDir) || fs.mkdirSync(templateDir)
;(async () => {
  const textData = await fs.promises.readFile(memeFile, 'utf-8')
  const jsonData = JSON.parse(textData)

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
          const ext = meme.url.split('.').pop()
          const filename = `${shortid.generate()}.${ext}`
          const templatePath = path.join(templateDir, filename)
          await downloadAndCompress(meme.url, templatePath)
          const dimensions = await sizeOf(templatePath)
          jsonData.memes.push({
            name: meme.name,
            width: dimensions.width,
            height: dimensions.height,
            boxCount: meme.box_count,
            filename,
            id: shortid.generate(),
            texts: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          nbNewMemes++
        } else {
          const templatePath = path.join(templateDir, jsonData.memes[index].filename)
          if (!fs.existsSync(templatePath)) await downloadAndCompress(meme.url, templatePath)
          const dimensions = await sizeOf(templatePath)
          jsonData.memes[index].height = dimensions.height
          jsonData.memes[index].width = dimensions.width
        }
      }
      const textResult = JSON.stringify(jsonData, null, 2)
      await fs.promises.writeFile(memeFile, textResult)
      console.log(`${nbNewMemes} memes have been added`)
    }
  )
})()
