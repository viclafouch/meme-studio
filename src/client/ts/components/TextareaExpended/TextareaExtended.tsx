import * as React from 'react'
import { useRef, useImperativeHandle } from 'react'
import './textarea-extended.scss'

const TextareaExtended = React.forwardRef(
  (props: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, ref: any) => {
    const textareaRef = useRef(null)

    useImperativeHandle(ref, () => ({
      focus: (): void => textareaRef.current.focus(),
    }))

    const handleKeyDown = (): void => {
      const textarea: HTMLTextAreaElement = textareaRef.current
      textarea.style.height = 'inherit'
      const computed: CSSStyleDeclaration = window.getComputedStyle(textarea)

      const height: number =
        parseInt(computed.getPropertyValue('border-top-width'), 10) +
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        textarea.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom'), 10) +
        parseInt(computed.getPropertyValue('border-bottom-width'), 10)

      textarea.style.height = height + 'px'
    }

    return (
      <textarea
        {...props}
        onChange={(e: any): void => props.onChange(e.target.value)}
        className="textarea-exdended"
        ref={textareaRef}
        onKeyDown={handleKeyDown}
      ></textarea>
    )
  }
)

export default TextareaExtended
