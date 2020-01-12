import * as React from 'react'

type TabProps = {
  children?: React.ReactNode
  active: boolean
  id?: string
}

function Tab(props: TabProps): JSX.Element {
  return (
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
  )
}

Tab.defaultProps = {
  active: false,
  id: ''
} as TabProps

export default Tab
