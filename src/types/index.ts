import { Tapped } from '../funcs/tap'
import { Observable } from './Observable'

/** Useful for `subscribe` functions built on `vana` */
export type Observed<T> = T extends Observable<infer U> ? U : Tapped<T>

export { Observable, IObserver } from './Observable'
export { OBinding } from './OBinding'
export { OPath } from './OPath'
export { OPromise } from './OPromise'
export { OProps } from './OProps'
export { OTuple, ObservedTuple } from './OTuple'
export { Change, IChangeTarget } from './Change'
