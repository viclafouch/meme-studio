import styled from 'styled-components'

export default {
  Section: styled.section`
    width: 100%;
    & + & {
      border-top: 1px solid rgba(255, 255, 255, 0.478);
    }
  `,
  Header: styled.header`
    background-color: rgb(88, 88, 88);
    cursor: pointer;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: rgb(212, 212, 212);
  `,
  Actions: styled.div`
    display: flex;
    align-items: center;
  `,
  Title: styled.p`
    font-weight: 600;
    font-size: 14px;
    max-width: 60%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    height: 1rem;
  `,
  Content: styled.div`
    background-color: rgb(68, 68, 68);
    overflow: hidden;
    transition-property: max-height;
    transition-timing-function: ease;
    transition-duration: 600ms;
    will-change: max-height, height;
  `
}
