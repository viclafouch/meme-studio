import { app } from './config/app'
import { IS_DEV, PORT_SERVER_DEV } from '../../shared/config'

const PORT = IS_DEV ? PORT_SERVER_DEV : JSON.parse(process.env.PORT || '3000')

function start(): void {
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}! \nisDev: ${IS_DEV}`))
}

export default start
