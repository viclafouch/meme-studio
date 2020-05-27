import { Model, DataTypes } from 'sequelize'
import database from '../config/database'

class Translation extends Model {
  public id: string
  public name!: string
  public keywords!: string
  public lang!: string
}

Translation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['en', 'fr']],
          msg: 'Must be English or French'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: false
    },
    memeId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'translations',
    sequelize: database,
    timestamps: false
  }
)

export default Translation
