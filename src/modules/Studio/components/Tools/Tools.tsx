import React from 'react'
import Link from 'next/link'
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
  return (
    <Styled.ToolsAside>
      <Styled.ToolsList>
        <Styled.ToolsListItem>
          <Styled.ToolsButton type="button">
            <FontAwesomeIcon icon={faCrop} />
          </Styled.ToolsButton>
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
          <Link href="/create" passHref>
            <a>
              <Styled.ToolsButton type="button">
                <FontAwesomeIcon icon={faTrashRestore} />
              </Styled.ToolsButton>
            </a>
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
