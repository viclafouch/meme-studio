import { z } from 'zod'
import {
  ALIGN_VERTICAL,
  FONTS_FAMILY,
  TEXT_ALIGN
} from '@shared/constants/fonts'
import { randomId } from '@shared/helpers/string'

export const textboxSchema = z
  .object({
    value: z.string().default(''),
    id: z.string().default(() => {
      return randomId()
    }),
    width: z.number(),
    height: z.number(),
    centerX: z.number(),
    centerY: z.number(),
    isUppercase: z.boolean().default(false),
    rotate: z.number().default(0),
    fontSize: z.number().default(80),
    fontFamily: z.enum(FONTS_FAMILY).default('Impact'),
    boxShadow: z.number().default(2),
    color: z.string().default('#ffffff'),
    textAlign: z.enum(TEXT_ALIGN).default('center'),
    alignVertical: z.enum(ALIGN_VERTICAL).default('middle')
  })
  .transform((textbox) => {
    return {
      ...textbox,
      base: {
        height: textbox.height,
        width: textbox.width,
        centerY: textbox.centerY,
        centerX: textbox.centerX
      }
    }
  })

export type TextBox = z.infer<typeof textboxSchema>

export function createTextBox(
  values: PartialWithRequired<
    TextBox,
    'centerX' | 'centerY' | 'width' | 'height'
  >
): TextBox {
  return textboxSchema.parse(values)
}
