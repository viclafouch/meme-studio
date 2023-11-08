import Link from 'next/link'
import styled from 'styled-components'

export default {
  Footer: styled.footer`
    text-align: center;
    padding-bottom: 1.25rem;
    width: 100%;
    font-size: 0.9rem;
    padding-top: 4rem;
  `,
  LinksList: styled.ul`
    display: flex;
    justify-content: center;
  `,
  Link: styled(Link)`
    display: block;
    margin: 0 0.6rem;
    color: rgba(161, 161, 161, 0.884);

    &:hover {
      color: rgba(219, 219, 219, 0.884);
    }
  `
}
