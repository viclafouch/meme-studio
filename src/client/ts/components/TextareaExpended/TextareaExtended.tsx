import * as React from 'react'
import { useRef, useImperativeHandle } from 'react'
import './textarea-extended.scss'

const TextareaExtended = React.forwardRef(
  (props: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, ref: any) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focus: (): void => textareaRef.current.focus()
    }))

    const moveCaretAtEnd = (): void => {
      const value = textareaRef.current.value
      textareaRef.current.value = ''
      textareaRef.current.value = value
    }

    return (
      <textarea
        {...props}
        onChange={props.onChange}
        className="textarea-exdended"
        ref={textareaRef}
        spellCheck="false"
        onFocus={moveCaretAtEnd}
      ></textarea>
    )
  }
)

export default TextareaExtended
