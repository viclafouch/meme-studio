import styled from 'styled-components'

const ToolsListItem = styled.li`
  width: 100%;
  border-bottom: 1px solid rgba(200, 200, 200, 0.397);
`

export default {
  ToolsAside: styled.aside`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgb(48, 48, 48);
    color: #ffffff;
    box-shadow: 2px 0px 5px 0px rgb(0 0 0 / 29%);
    z-index: 3;
    position: relative;
  `,
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
    font-family: 'Alata', sans-serif;
    font-weight: 400;
    color: #ffffff;
  `
}
