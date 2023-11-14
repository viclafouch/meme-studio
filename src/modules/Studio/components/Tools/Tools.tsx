import React from 'react'
import Link from 'next/link'
import Tooltip from '@components/Tooltip'
import { useHistory } from '@stores/Editor/hooks/useHistory'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useCountTexts } from '@stores/Editor/hooks/useTexts'
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
  const { showTextAreas, toggleShowTextAreas, eraseAllTexts, resetAll } =
    useTools()
  const countTexts = useCountTexts()
  const meme = useMeme()
  const { canUndo, canRedo, undo, redo } = useHistory()

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
            disabled={countTexts === 0}
            position="right"
          >
            <Styled.ToolsButton
              type="button"
              disabled={countTexts === 0}
              onClick={handleClick(toggleShowTextAreas)}
            >
              <FontAwesomeIcon icon={faCrop} />
            </Styled.ToolsButton>
          </Tooltip>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Tooltip text="Annuler" disabled={!canUndo} position="right">
            <Styled.ToolsButton
              type="button"
              disabled={!canUndo}
              onClick={handleClick(undo)}
            >
              <FontAwesomeIcon icon={faUndo} />
            </Styled.ToolsButton>
          </Tooltip>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Tooltip text="Rétablir" disabled={!canRedo} position="right">
            <Styled.ToolsButton
              type="button"
              disabled={!canRedo}
              onClick={handleClick(redo)}
            >
              <FontAwesomeIcon icon={faRedo} />
            </Styled.ToolsButton>
          </Tooltip>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Tooltip
            text="Écraser tout"
            disabled={countTexts === 0}
            position="right"
          >
            <Styled.ToolsButton
              type="button"
              disabled={countTexts === 0}
              onClick={handleClick(eraseAllTexts)}
            >
              <FontAwesomeIcon icon={faEraser} />
            </Styled.ToolsButton>
          </Tooltip>
        </Styled.ToolsListItem>
        <Styled.ToolsListItem>
          <Tooltip text="Réinitialiser" disabled={!meme} position="right">
            {!meme ? (
              <Styled.ToolsButton disabled>
                <FontAwesomeIcon icon={faTrashRestore} />
              </Styled.ToolsButton>
            ) : (
              <Styled.ToolsButton as={Link} href="/create" onClick={resetAll}>
                <FontAwesomeIcon icon={faTrashRestore} />
              </Styled.ToolsButton>
            )}
          </Tooltip>
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

export default React.memo(Tools)
