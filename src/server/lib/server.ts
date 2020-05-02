import { app } from './config/app'
import { IS_DEV, PORT_SERVER_DEV, PORT_SERVER_PROD } from '../../shared/config'

const PORT = IS_DEV ? PORT_SERVER_DEV : PORT_SERVER_PROD

async function start(): Promise<void> {
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}! \nisDev: ${IS_DEV}`))
}

export default start
