import { Model, DataTypes } from 'sequelize'
import * as shortid from 'shortid'
import { database } from '../config/database'
import TextBox from './textbox.model'

class Meme extends Model {
  public id!: number
  public name!: string
  public width!: number
  public height!: number
  public boxCount!: number
  public filename!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public texts: Array<TextBox>
}

Meme.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        customValidator(value: string): void {
          const [_, ext] = value.split('.')
          if (!['jpeg', 'jpg', 'png'].includes(ext)) {
            throw new Error(`filename has not a valid extension (${ext})`)
          }
        }
      }
    },
    width: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    height: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    boxCount: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
      validate: {
        len: [0, 10]
      }
    }
  },
  {
    tableName: 'memes',
    sequelize: database
  }
)

Meme.hasMany(TextBox, { as: 'texts', foreignKey: 'memeId' })

export default Meme
