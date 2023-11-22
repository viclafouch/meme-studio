import styled from 'styled-components'

const ToolsListItem = styled.li`
  width: 100%;
  border-bottom: 1px solid rgba(200, 200, 200, 0.397);
`

export default {
  ToolsListItem,
  ToolsList: styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;

    &:last-child ${ToolsListItem} {
      border-bottom: 0;
      border-top: 1px solid rgba(200, 200, 200, 0.397);
    }
  `,
  ToolsButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 54px;
    cursor: pointer;
    border: 0;
    background-color: transparent;
    padding: 1px 7px 2px;
    font-size: 13px;
    font-family: inherit;
    font-weight: 400;
    color: #ffffff;

    &:disabled {
      color: rgb(146, 146, 146);
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      color: #c5c5c5;
    }
  `
}
