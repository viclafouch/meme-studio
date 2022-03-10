export type State = {
  width: number
  height: number
  left: number
  top: number
  mode: false | 'dragging'
  downStartX: Nullable<number>
  downStartY: Nullable<number>
}

export type MaxSizes = {
  width: number
  height: number
}

export type MoveReturn = Pick<State, 'left' | 'top'>
