import styled from 'styled-components'

export default {
  Scrollable: styled.div`
    overflow-y: auto;
  `,
  BlockTitle: styled.div`
    text-align: center;
    font-size: 1.1rem;
    margin: 1.25rem;
    padding: 0 1rem;
    line-height: 1.2rem;
  `,
  Legend: styled.span`
    text-align: center;
    font-size: 1.1rem;
    margin: 1.25rem;
    padding: 0 1rem;
    line-height: 1.2rem;
    color: rgb(212, 212, 212);
  `,
  MemeName: styled.h1`
    font-size: 0.7rem;
    color: #8d8d8d;
    display: inline-block;
    margin: 0 auto;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  TextBlocks: styled.div`
    display: flex;
    flex-direction: column;
  `,
  ActionButton: styled.button`
    background-color: transparent;
    border: 0;
  `
}
