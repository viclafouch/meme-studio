import { Model, DataTypes } from 'sequelize'
import database from '../config/database'

import { FONTS_FAMILY, ALIGN_VERTICAL, TEXT_ALIGN } from '@shared/config'

class TextBox extends Model {
  public id: string
  public value: string
  public height!: number
  public width!: number
  public fontSize!: number
  public fontFamily!: string
  public boxShadow!: number
  public color!: string
  public centerY!: number
  public centerX!: number
  public textAlign!: string
  public alignVertical!: string
  public rotate: number
  public isUppercase: boolean
  public memeId!: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
}

TextBox.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: {
      type: new DataTypes.STRING(128),
      defaultValue: ''
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    centerX: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    centerY: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rotate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        len: [0, 360]
      }
    },
    fontSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fontFamily: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [FONTS_FAMILY]
      }
    },
    boxShadow: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        is: /^(#[a-f0-9]{6}|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/i
      }
    },
    alignVertical: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [ALIGN_VERTICAL]
      }
    },
    textAlign: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isIn: [TEXT_ALIGN]
      }
    },
    isUppercase: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      get(): boolean {
        return !!this.getDataValue('isUppercase')
      }
    },
    memeId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'textbox',
    sequelize: database
  }
)

export default TextBox
