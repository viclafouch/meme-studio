import styled from 'styled-components'

const Styled = {
  Button: styled.button`
    font-family: Alata, sans-serif;
    background-color: #4d90fe;
    color: #ffffff;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.14);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 0;
    outline: none;
    transition-property: opacity, box-shadow, background-color;
    transition-duration: 0.3s;
    letter-spacing: 0.5px;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    appearance: none;
    text-rendering: auto;
    text-decoration: none;
    margin: 0;
    padding: 14px 18px;
    font-size: 16px;
    line-height: 22px;

    &:hover {
      background-color: #649fff;
    }
  `
}

export default Styled
