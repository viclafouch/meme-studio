import * as React from 'react'
import { useRef } from 'react'
import './textarea-extended.scss'

function TextareaExtended(
  props: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
): JSX.Element {
  const textareaRef = useRef(null)

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
      className="Textarea-exdended"
      ref={textareaRef}
      onKeyDown={handleKeyDown}
    ></textarea>
  )
}

export default TextareaExtended
