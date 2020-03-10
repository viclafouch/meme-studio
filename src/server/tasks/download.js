const fs = require('fs')
const shortid = require('shortid')
const request = require('request')
var { promisify } = require('util')
var sizeOf = promisify(require('image-size'))

const download = (uri, filename) => new Promise((resolve, reject) => {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve)
  })
})


;(async () => {
  const textData = await fs.promises.readFile('memes.json', 'utf-8')
  const jsonData = JSON.parse(textData)

  request({
    url: 'https://api.imgflip.com/get_memes',
    json: true
  }, async function(_, _, body) {
    if (!body.success) throw new Error('Something wrong happened!')
    for (const meme of body.data.memes.filter(m => !jsonData.memes.find(item => item.name === m.name))) {
      const templateSrc = `templates/${shortid.generate()}.jpg`
      await download(meme.url, templateSrc)
      const dimensions = await sizeOf(templateSrc)
      jsonData.memes.push({
        name: meme.name,
        width: dimensions.width,
        height: dimensions.height,
        boxCount: meme.box_count,
        src: templateSrc
      })
    }

    const textResult = JSON.stringify(jsonData, null, 2)
    await fs.promises.writeFile('memes.json', textResult)
  })
})()
