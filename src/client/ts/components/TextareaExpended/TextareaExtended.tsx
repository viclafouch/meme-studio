import * as React from 'react'
import { useRef, useImperativeHandle, useEffect } from 'react'
import './textarea-extended.scss'

const TextareaExtended = React.forwardRef(
  (props: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, ref: any) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focus: (): void => textareaRef.current.focus(),
    }))

    const resize = (): void => {
      const textarea: HTMLTextAreaElement = textareaRef.current
      textarea.style.height = 'inherit'
      const computed: CSSStyleDeclaration = window.getComputedStyle(textarea)

      const height: number =
        parseInt(computed.getPropertyValue('border-top-width')) +
        parseInt(computed.getPropertyValue('padding-top')) +
        textarea.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom')) +
        parseInt(computed.getPropertyValue('border-bottom-width'))

      textarea.style.height = height + 'px'
    }

    const moveCaretAtEnd = (): void => {
      const value = textareaRef.current.value
      textareaRef.current.value = ''
      textareaRef.current.value = value
    }

    useEffect(() => {
      setTimeout(resize, 0)
    }, [])

    return (
      <textarea
        {...props}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
          props.onChange(e)
          resize()
        }}
        className="textarea-exdended"
        ref={textareaRef}
        onFocus={moveCaretAtEnd}
      ></textarea>
    )
  }
)

export default TextareaExtended
