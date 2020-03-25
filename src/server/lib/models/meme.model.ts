import { Model, DataTypes } from 'sequelize'
import * as shortid from 'shortid'
import { database } from '../config/database'
import TextBox from './textbox.model'

class Meme extends Model {
  public id!: number
  public uuid!: string
  public name!: string
  public width!: number
  public height!: number
  public boxCount!: number
  public ext!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public texts: Array<TextBox>

  static getUrl(baseUrl: string, uuid: string, ext: string): string {
    return `${baseUrl}/templates/${uuid}.${ext}`
  }
}

Meme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: new DataTypes.STRING(),
      allowNull: false,
      validate: {
        customValidator(value: string): void {
          if (!shortid.isValid(value)) {
            throw new Error(`Uuid is not valid (${value})`)
          }
        },
      },
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    width: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
    },
    height: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
    },
    boxCount: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
      validate: {
        len: [0, 10],
      },
    },
    ext: {
      type: new DataTypes.STRING(),
      allowNull: false,
      validate: {
        isIn: [['jpeg', 'jpg', 'png']],
      },
    },
  },
  {
    tableName: 'memes',
    sequelize: database,
  }
)

Meme.hasMany(TextBox, { as: 'texts', foreignKey: 'memeId' })

export default Meme
