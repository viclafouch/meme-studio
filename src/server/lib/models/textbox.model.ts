import { Model, DataTypes } from 'sequelize'
import { database } from '../config/database'
import { FONTS_FAMILY } from '@shared/config'

export class TextBox extends Model {
  public id: number
  public value: string
  public height: number
  public width: number
  public fontSize: number
  public fontFamily: string
  public boxShadow: number
  public color: string
  public centerY: number
  public centerX: number
  public textAlign: string
  public alignVertical: string
  public rotate: number
  public isUppercase: boolean
  public memeId: number
  public readonly createdAt: Date
  public readonly updatedAt: Date
  static associate: (models: object) => void
}

TextBox.init(
  {
    id: {
      type: new DataTypes.STRING(),
      primaryKey: true
    },
    value: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      defaultValue: ''
    },
    width: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    height: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    centerX: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    centerY: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    rotate: {
      type: new DataTypes.NUMBER(),
      allowNull: false,
      defaultValue: 0,
      validate: {
        len: [0, 360]
      }
    },
    fontSize: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    fontFamily: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [FONTS_FAMILY]
      }
    },
    boxShadow: {
      type: new DataTypes.NUMBER(),
      allowNull: false
    },
    color: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        is: /^(#[a-f0-9]{6}|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/i
      }
    },
    alignVertical: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [['top', 'middle', 'bottom']]
      }
    },
    textAlign: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [['left', 'center', 'right']]
      }
    },
    isUppercase: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      get(): boolean {
        return !!this.getDataValue('isUppercase')
      }
    },
    memeId: {
      type: new DataTypes.STRING(),
      allowNull: false
    }
  },
  {
    tableName: 'textbox',
    sequelize: database
  }
)

export default TextBox
