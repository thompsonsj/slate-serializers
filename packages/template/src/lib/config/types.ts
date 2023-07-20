import { SlateToDomConfig } from '@slate-serializers/dom'

export type ElementSerializer = 
  ({
    node,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node?: any
  }) => unknown


interface ElementSerializers {
  [key: string]: ElementSerializer
}

export interface Config extends SlateToDomConfig {
  customElementSerializers?: ElementSerializers
}
