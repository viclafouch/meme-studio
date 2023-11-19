import { z } from 'zod'
import {
  ALIGN_VERTICAL,
  FONTS_FAMILY,
  TEXT_ALIGN
} from '@shared/constants/fonts'
import { randomId } from '@shared/helpers/string'

export const textboxSchema = z
  .object({
    id: z.string().default(() => {
      return randomId()
    }),
    properties: z.object({
      value: z.string().default(''),
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
  })
  .transform((values) => {
    return {
      ...values,
      baseProperties: {
        height: values.properties.height,
        width: values.properties.width,
        centerY: values.properties.centerY,
        centerX: values.properties.centerX
      }
    }
  })

export type TextBox = z.infer<typeof textboxSchema>

export function createTextBox(
  values: PartialWithRequired<
    TextBox['properties'],
    'centerX' | 'centerY' | 'width' | 'height'
  >
): TextBox {
  return textboxSchema.parse(values)
}
