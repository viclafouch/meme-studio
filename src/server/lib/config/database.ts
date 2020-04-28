import { Sequelize } from 'sequelize'

export const database = new Sequelize({
  database: 'some_db',
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
})
