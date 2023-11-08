import styled from 'styled-components'
import Button from '@components/Button/Button'

export default {
  ContentBlock: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    text-align: center;
    margin-top: 4rem;
  `,
  Caption: styled.p`
    font-size: 1.125rem;
    line-height: 1.375rem;
    max-width: 37.5rem;
    text-align: center;
    margin: 1.25rem auto;
  `,
  Link: styled(Button)`
    width: 100%;
    max-width: 40.625rem;
    margin-left: auto;
    margin-right: auto;
  `,
  MemesList: styled.ul`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 2rem;
    gap: 2rem;
    list-style: none;
  `,
  MemeArticle: styled.article`
    width: 12.5rem;
    border: 0.125rem solid #000000;
  `
}
