import React from 'react'
import Link from 'next/link'
import Tooltip from '@components/Tooltip'
import { useTools } from '@stores/Editor/hooks/useTools'
import {
  faCrop,
  faEraser,
  faQuestionCircle,
  faRedo,
  faSun,
  faTrashRestore,
  faUndo
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './tools.styled'

const Tools = () => {
  const { showTextAreas, toggleShowTextAreas } = useTools()

  const handleClick = (callback: () => void) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      callback()
    }
  }

  return (
    <Styled.ToolsAside>
      <Styled.ToolsList>
        <Styled.ToolsListItem>
          <Tooltip
            text={
              showTextAreas
                ? 'Cacher les zones de texte'
                : 'Afficher les zones de texte'
            }
            position="right"
          >
            <Styled.ToolsButton
              type="button"
              onClick={handleClick(toggleShowTextAreas)}
            >
              <FontAwesomeIcon icon={faCrop} />
            </Styled.ToolsButton>
          </Tooltip>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Styled.ToolsButton type="button">
            <FontAwesomeIcon icon={faUndo} />
          </Styled.ToolsButton>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Styled.ToolsButton type="button">
            <FontAwesomeIcon icon={faRedo} />
          </Styled.ToolsButton>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Styled.ToolsButton type="button">
            <FontAwesomeIcon icon={faEraser} />
          </Styled.ToolsButton>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Link href="/create">
            <Styled.ToolsButton type="button">
              <FontAwesomeIcon icon={faTrashRestore} />
            </Styled.ToolsButton>
          </Link>
        </Styled.ToolsListItem>
      </Styled.ToolsList>
      <Styled.ToolsList>
        <Styled.ToolsListItem>
          <Styled.ToolsButton type="button">
            <FontAwesomeIcon icon={faSun} />
          </Styled.ToolsButton>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Styled.ToolsButton type="button">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Styled.ToolsButton>
        </Styled.ToolsListItem>
      </Styled.ToolsList>
    </Styled.ToolsAside>
  )
}

export default Tools
