import HttpException from './HttpException'

class MemeNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Meme with id #${id} not found`)
  }
}

export default MemeNotFoundException
