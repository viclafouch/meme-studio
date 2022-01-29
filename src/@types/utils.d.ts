type FileType = 'video' | 'image' | 'unknown'

type Complete<T> = {
  [P in keyof T]-?: T[P]
}

type ValueOf<T> = T[keyof T]
type KeysOf<T> = (keyof T)[]

type UnknownObject = Record<string, unknown>

type Nullable<T> = T | null

type UndefinedKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

type ExtractOptional<T> = Pick<T, Exclude<UndefinedKeys<T>, undefined>>

type DefaultProps<T> = Required<ExtractOptional<T>>

type NoNullFields<Ob> = { [K in keyof Ob]: NonNullable<Ob[K]> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownAsyncCallback = (...params: any[]) => Promise<any>

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T
