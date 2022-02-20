import Page from '@components/Page/Page'
import styled from 'styled-components'

export default {
  Page: styled(Page)`
    height: 100vh;
  `,
  Studio: styled.div`
    width: 100%;
    height: calc(100vh - 5rem);
    display: grid;
    grid-template-columns: 3.375rem auto 20rem;
    overflow: hidden;
    background-color: rgb(68, 68, 68);
  `,
  DefaultContainer: styled.div`
    height: 100%;
    width: 100%;
    padding: 3.125rem 6.25rem;
    position: relative;
    border-right: 0.125rem solid rgb(88, 88, 88);
  `
}
