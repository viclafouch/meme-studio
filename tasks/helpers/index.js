require('dotenv').config()
const fs = require('fs')
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

const setCurrentMemes = async (jsonData) => {
  const textData = JSON.stringify(jsonData, null, 2)
  await fs.promises.writeFile(memeFile, textData)
}

const createMeme = async ({ url, memeName, boxCount }) => {
  let filename
  const ext = url.split('.').pop()
  const name = `${shortid.generate()}.${ext}`
  if (url.startsWith('http')) {
    filename = path.join(templateDir, name)
    await downloadAndCompress(url, filename)
  } else {
    filename = path.join(templateDir, name)
    fs.renameSync(url, filename)
    await compressFile(filename)
  }
  const dimensions = await sizeOf(filename)
  return {
    name: memeName,
    width: dimensions.width,
    height: dimensions.height,
    boxCount: boxCount,
    filename: name,
    id: shortid.generate(),
    texts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

const convertToWebP = (input, output) =>
  new Promise((resolve, reject) =>
    webp.cwebp(input, output, '-q 80', function (status, error) {
      if (status == 100) resolve()
      else reject(error)
    })
  )

const compressFile = async (filename) => {
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
