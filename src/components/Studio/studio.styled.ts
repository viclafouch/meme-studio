import { PARTICLES_BACKGROUND } from '@styles/utils'
import styled from 'styled-components'

export default {
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
  `
}
