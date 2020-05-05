import { Sequelize } from 'sequelize'
import { IS_DEV } from '@shared/config'

let database: Sequelize

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL && !IS_DEV) console.info('No DATABASE_URL provided, use dev database instead.')

if (process.env.NODE_ENV === 'test') {
  database = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:'
  })
} else if (IS_DEV || !DATABASE_URL) {
  database = new Sequelize({
    dialect: 'sqlite',
    storage: './db.development.sqlite',
    logging: false
  })
} else {
  database = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
}

export default database
