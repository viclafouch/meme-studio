'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Tooltip from '@components/Tooltip'
import { Link } from '@i18n/navigation'
import { Flex, styled } from '@styled-system/jsx'
import {
  useCountTextboxes,
  useHistory,
  useMeme,
  useTools
} from '@viclafouch/meme-studio-utilities/hooks'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import {
  faCrop,
  faCropSimple,
  faEraser,
  faQuestionCircle,
  faRedo,
  faSquare as faSquareFilled,
  faTrashRestore,
  faUndo
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { buttonRecipe, ToolsButton, ToolsListItem } from './Tools.styles'

const Tools = () => {
  const t = useTranslations()
  const {
    isVisibleDraggables,
    toggleVisibleDraggables,
    eraseAllItems,
    resetAll,
    toggleTopBlockVisible,
    isTopBlockVisible
  } = useTools()
  const countTexts = useCountTextboxes()
  const meme = useMeme()

  const { canUndo, canRedo, undo, redo } = useHistory()

  const handleClick = (callback: () => void) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      callback()
    }
  }

  return (
    <Flex
      direction="column"
      width="full"
      height="full"
      justify="space-between"
      color="white"
      zIndex={3}
      position="relative"
      bgColor="secondary.dark"
      boxShadow="2px 0px 5px 0px rgb(0 0 0 / 29%)"
    >
      <styled.ul display="flex" flexDir="column" alignItems="center">
        <ToolsListItem>
          <Tooltip
            text={
              isVisibleDraggables
                ? t('tools.hideDraggableVisible')
                : t('tools.showDraggableVisible')
            }
            disabled={countTexts === 0}
            position="right"
          >
            <ToolsButton
              type="button"
              disabled={countTexts === 0}
              onClick={handleClick(toggleVisibleDraggables)}
            >
              <FontAwesomeIcon
                icon={isVisibleDraggables ? faCropSimple : faCrop}
              />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip
            text={
              isTopBlockVisible
                ? t('tools.deleteTopBlock')
                : t('tools.addTopBlock')
            }
            position="right"
          >
            <ToolsButton
              type="button"
              disabled={!meme}
              onClick={handleClick(toggleTopBlockVisible)}
            >
              <FontAwesomeIcon
                icon={isTopBlockVisible ? faSquareFilled : faSquare}
              />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t('tools.undo')} disabled={!canUndo} position="right">
            <ToolsButton
              type="button"
              disabled={!canUndo}
              onClick={handleClick(undo)}
            >
              <FontAwesomeIcon icon={faUndo} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t('tools.redo')} disabled={!canRedo} position="right">
            <ToolsButton
              type="button"
              disabled={!canRedo}
              onClick={handleClick(redo)}
            >
              <FontAwesomeIcon icon={faRedo} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip
            text={t('tools.eraseAll')}
            disabled={countTexts === 0}
            position="right"
          >
            <ToolsButton
              type="button"
              disabled={countTexts === 0}
              onClick={handleClick(eraseAllItems)}
            >
              <FontAwesomeIcon icon={faEraser} />
            </ToolsButton>
          </Tooltip>
        </ToolsListItem>
        <ToolsListItem>
          <Tooltip text={t('tools.reset')} disabled={!meme} position="right">
            {!meme ? (
              <ToolsButton disabled>
                <FontAwesomeIcon icon={faTrashRestore} />
              </ToolsButton>
            ) : (
              <Link
                className={buttonRecipe()}
                href="/create"
                onClick={resetAll}
              >
                <FontAwesomeIcon icon={faTrashRestore} />
              </Link>
            )}
          </Tooltip>
        </ToolsListItem>
      </styled.ul>
      <styled.ul display="flex" flexDir="column" alignItems="center">
        <ToolsListItem>
          <ToolsButton type="button">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </ToolsButton>
        </ToolsListItem>
      </styled.ul>
    </Flex>
  )
}

export default React.memo(Tools)
