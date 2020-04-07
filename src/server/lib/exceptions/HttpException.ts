class HttpException extends Error {
  status: number
  message: string
  constructor(status: number, message?: string) {
    super(message)
    this.status = status
    this.message = message || 'Something went wrong'
  }
}

export default HttpException
