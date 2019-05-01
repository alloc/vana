import { Observable } from './Observable'
import { Tapped } from './tap'

/** Useful for `subscribe` functions built on `vana` */
export type Observed<T> = T extends Observable<infer U> ? U : Tapped<T>

// Classes
export * from './Observable'
export * from './OBinding'
export * from './OPath'
export * from './OPromise'
export * from './OProps'
export * from './OTuple'
export * from './Change'

// Functions
export * from './array'
export * from './become'
export * from './commit'
export * from './commitArray'
export * from './commitIndices'
export * from './freeze'
export * from './keepAlive'
export * from './latest'
export * from './o'
export * from './revise'
export * from './tap'
export * from './watch'

// Immer
export { Draft, Immutable, isDraft, nothing, original, immerable } from 'immer'
export { Recipe, produce, setUseProxies, setAutoFreeze } from '../shared/immer'

// Shared
export { Disposable, IDisposable, IThenable, $O } from '../shared'
