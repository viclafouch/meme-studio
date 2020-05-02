import { Model, DataTypes } from 'sequelize'
import database from '../config/database'
import TextBox from './textbox.model'

class Meme extends Model {
  public id: string
  public name!: string
  public width!: number
  public height!: number
  public boxCount!: number
  public filename!: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    boxCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [0, 10]
      }
    }
  },
  {
    tableName: 'memes',
    sequelize: database,
    timestamps: true
  }
)

Meme.hasMany(TextBox, { as: 'texts', foreignKey: 'memeId' })

export default Meme
