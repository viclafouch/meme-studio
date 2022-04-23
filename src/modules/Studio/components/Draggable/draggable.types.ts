export type Side = 'ne' | 'nw' | 'se' | 'sw'

export type State = {
  width: number
  height: number
  rotate: number
  heightOnDown: Nullable<number>
  widthOnDown: Nullable<number>
  topOnDown: Nullable<number>
  leftOnDown: Nullable<number>
  left: number
  top: number
  mode: false | 'dragging' | `resizing-${Side}` | 'rotating'
  downStartX: Nullable<number>
  downStartY: Nullable<number>
  downPageX: Nullable<number>
  downPageY: Nullable<number>
  radOnDown: Nullable<number>
  startOffsetTop: Nullable<number>
  startOffsetLeft: Nullable<number>
}

export type MaxSizes = {
  width: number
  height: number
}
