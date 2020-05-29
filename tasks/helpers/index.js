require('dotenv').config()
const fs = require('fs')
const pngToJpeg = require('png-to-jpeg')
const shortid = require('shortid')
const path = require('path')
const request = require('request')
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
const tinify = require('tinify')
const webp = require('webp-converter')

if (!process.env.TINY_KEY) {
  throw new Error('Please provide a TINY_KEY from https://tinypng.com/developers')
}

tinify.key = process.env.TINY_KEY

const useCompression = true
const maxHeight = 800
const maxWidth = 800

const memeFile = path.resolve('src', 'server', 'memes.json')
const templateDir = './static/templates'

fs.existsSync(memeFile) || fs.writeFileSync(memeFile, JSON.stringify({ memes: [] }, null, 2))
fs.existsSync(templateDir) || fs.mkdirSync(templateDir)

const getCurrentMemes = async () => {
  const textData = await fs.promises.readFile(memeFile, 'utf-8')
  return JSON.parse(textData)
}

const setCurrentMemes = async jsonData => {
  const textData = JSON.stringify(jsonData, null, 2)
  await fs.promises.writeFile(memeFile, textData)
}

const createMeme = async ({ url, memeName, boxCount, keywords }) => {
  let filename
  const name = `${shortid.generate()}.jpg`
  if (url.startsWith('http')) {
    filename = path.join(templateDir, name)
    await downloadAndCompress(url, filename)
  } else {
    if (!fs.existsSync(url)) {
      throw new Error('File does not exist.')
    }
    if (url.endsWith('.png')) {
      const buffer = fs.readFileSync(url)
      const jpgFile = await pngToJpeg({ quality: 90 })(buffer)
      fs.writeFileSync(url.replace('.png', '.jpg'), jpgFile)
      fs.unlinkSync(url)
      url = url.replace('.png', '.jpg')
    }
    filename = path.join(templateDir, name)
    fs.renameSync(url, filename)
    await compressFile(filename)
  }
  const dimensions = await sizeOf(filename)
  return {
    width: dimensions.width,
    height: dimensions.height,
    boxCount: boxCount,
    filename: name,
    id: shortid.generate(),
    texts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    translations: {
      fr: {
        name: memeName,
        keywords: keywords
      },
      en: {
        name: memeName,
        keywords: keywords
      }
    }
  }
}

const convertToWebP = (input, output) =>
  new Promise((resolve, reject) =>
    webp.cwebp(input, output, '-q 80', function (status, error) {
      if (status == 100) resolve()
      else reject(error)
    })
  )

const compressFile = async filename => {
  let source = tinify.fromFile(filename)
  const { height, width } = await sizeOf(filename)
  if (height > maxHeight)
    source = source.resize({
      method: 'scale',
      height: maxHeight
    })
  if (width > maxWidth)
    source = source.resize({
      method: 'scale',
      width: maxWidth
    })
  console.log(`Compressing ${filename}...`)
  await source.toFile(filename)
}

const downloadAndCompress = async (uri, filename) => {
  await new Promise((resolve, reject) => {
    request.head(uri, function (err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve)
    })
  })
  if (filename.endsWith('.png')) {
    const buffer = fs.readFileSync(filename)
    await pngToJpeg({ quality: 90 })(buffer).then(output => {
      fs.writeFileSync(filename.replace('.png', '.jpg'), output)
      fs.unlinkSync(filename)
    })
  }
  if (useCompression) await compressFile(filename)
}

module.exports = {
  downloadAndCompress,
  memeFile,
  templateDir,
  convertToWebP,
  getCurrentMemes,
  setCurrentMemes,
  createMeme,
  templateDir
}
