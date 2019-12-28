import * as React from 'react'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorContext } from '@store/EditorContext'
import { SET_SHOW_TEXT_AREAS } from '@store/reducer/constants'
import './tools.scss'

function Tools(): JSX.Element {
  const [{ showTextAreas }, dispatchEditor] = useContext(EditorContext)
  return (
    <div className="Tools">
      <ul className="list-tools">
        <li>
          <div
            className="tool"
            role="button"
            onClick={(): void =>
              dispatchEditor({
                type: SET_SHOW_TEXT_AREAS,
                showTextAreas: !showTextAreas
              })
            }
          >
            <FontAwesomeIcon icon={['fas', 'crop-alt']} />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Tools
