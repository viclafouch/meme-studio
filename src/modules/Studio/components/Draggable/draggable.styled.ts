import styled from 'styled-components'

const resizeSize = '1.125rem'

export default {
  Draggable: styled.div`
    background-color: transparent;
    position: absolute;
    z-index: 1;
    border: 0.0625rem dotted rgba(14, 42, 71, 0.6);
    cursor: move;
  `,
  Resize: styled.div`
    display: block;
    width: ${resizeSize};
    height: ${resizeSize};
    border-radius: 50%;
    background-color: #305ba1;
    z-index: 2;
    position: absolute;
    transform: translate(-50%, -50%);
    border: 1px solid #ffffff;

    &[data-side='nw'],
    &[data-side='se'] {
      cursor: nwse-resize;
    }
    &[data-side='ne'],
    &[data-side='sw'] {
      cursor: nesw-resize;
    }
    &[data-side^='n'] {
      top: 0;
    }
    &[data-side^='s'] {
      top: 100%;
    }
    &[data-side$='e'] {
      left: 100%;
    }
    &[data-side$='w'] {
      left: 0;
    }
  `,
  Rotate: styled.span`
    padding: 0.3rem;
    border: 0.0625rem solid #ffffff;
    height: 1.25rem;
    width: 1.25rem;
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.3rem;
    transform: translateX(-50%);
    background-color: #305ba1;
    position: absolute;
    top: calc(100% + 1rem);
    left: 50%;
    color: rgba(255, 255, 255, 0.6);

    svg {
      width: 0.8rem;
      height: 0.8rem;
    }
  `
}
