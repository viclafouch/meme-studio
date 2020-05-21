import * as React from 'react'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { Modal } from '@client/components/Modal/Modal'

type TabProps = {
  children?: React.ReactNode
  onCloseModal: () => void
  active: boolean
  id?: string
}

function Tab(props: TabProps): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  return isMinLgSize ? (
    <div
      aria-hidden={!props.active}
      className="tab"
      id={props.id}
      style={{
        ...(!props.active ? { display: 'none' } : null)
      }}
    >
      {props.children}
    </div>
  ) : props.active ? (
    <Modal id={props.id} onClose={props.onCloseModal}>
      {props.children}
    </Modal>
  ) : null
}

Tab.defaultProps = {
  active: false,
  id: ''
} as TabProps

export default Tab
