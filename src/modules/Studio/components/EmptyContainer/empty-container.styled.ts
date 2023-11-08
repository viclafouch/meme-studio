import styled from 'styled-components'
import { PARTICLES_BACKGROUND } from '@styles/utils'

export default {
  Container: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    ${PARTICLES_BACKGROUND};
    height: 100%;
    width: 100%;
  `,
  ChooseTypography: styled.p`
    margin-top: 1rem;
    line-height: 1.2rem;
    color: rgb(212, 212, 212);
  `,
  FileInput: styled.input`
    visibility: hidden;
    width: 0;
    height: 0;
    opacity: 0;
    position: absolute;
  `,
  ClickableBrowse: styled.span`
    text-decoration: underline;
    color: #709ee8;
    cursor: pointer;
  `
}
