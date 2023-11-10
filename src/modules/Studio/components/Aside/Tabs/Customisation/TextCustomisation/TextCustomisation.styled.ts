import styled from 'styled-components'

export default {
  TextCustomisation: styled.div`
    display: block;
    color: rgb(212, 212, 212);
  `,
  TextToolsContainer: styled.div`
    padding: 0.8125rem 0.875rem 1.4375rem 0.875rem;
  `,
  Fieldset: styled.fieldset`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.625rem;
  `,
  Textarea: styled.textarea`
    padding: 0.625rem;
    width: 100%;
    width: 100%;
    font-size: 0.875rem;
    display: block;
    font-family: Arial;
    resize: none;
    border-radius: 0.125rem;
    border: 0.125rem solid rgba(189, 189, 189, 0.541);
    background-color: rgb(68, 68, 68);
    color: rgb(212, 212, 212);
  `
}
