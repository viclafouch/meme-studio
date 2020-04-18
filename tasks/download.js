const fs = require('fs')
const path = require('path')
const shortid = require('shortid')
const request = require('request')
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))

const memeFile = path.resolve('src', 'server', 'memes.json')
const templateDir = './static/templates'

const download = (uri, filename) => new Promise((resolve, reject) => {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve)
  })
})

fs.existsSync(memeFile) || fs.writeFileSync(memeFile, JSON.stringify({ memes: []}, null, 2))
fs.existsSync(templateDir) || fs.mkdirSync(templateDir)

;(async () => {
  const textData = await fs.promises.readFile(memeFile, 'utf-8')
  const jsonData = JSON.parse(textData)

  request({
    url: 'https://api.imgflip.com/get_memes',
    json: true
  }, async function(_, _, body) {
    let nbNewMemes = 0
    if (!body.success) throw new Error('Something wrong happened with imgflip!')
    for (const meme of body.data.memes) {
      const index = jsonData.memes.findIndex(m => meme.name === m.name)
      if (index === -1) {
        const uuid = shortid.generate()
        const ext = meme.url.split('.').pop()
        const filename = `${uuid}.${ext}`
        const templatePath = path.join(templateDir, filename)
        await download(meme.url, templatePath)
        const dimensions = await sizeOf(templatePath)
        jsonData.memes.push({
          name: meme.name,
          width: dimensions.width,
          height: dimensions.height,
          boxCount: meme.box_count,
          uuid,
          ext,
          texts: []
        })
        nbNewMemes++
      } else {
        const filename = `${jsonData.memes[index].uuid}.${jsonData.memes[index].ext}`
        const templatePath = path.join(templateDir, filename)
        if (!fs.existsSync(templatePath))
          await download(meme.url, templatePath)
        const dimensions = await sizeOf(templatePath)
        jsonData.memes[index].height = dimensions.height
        jsonData.memes[index].width = dimensions.width
      }
    }
    const textResult = JSON.stringify(jsonData, null, 2)
    await fs.promises.writeFile(memeFile, textResult)
    console.log(`${nbNewMemes} memes have been added`)
  })
})()
