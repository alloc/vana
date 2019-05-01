import { IThenable } from '../shared'
import { getObservable, IObserver } from './Observable'
import { PromiseState } from './OPromise'

export type Tapped<T> = T extends IThenable<infer U> ? PromiseState<U> : T

/** Listen to an observable value for changes. */
export function tap<T extends object>(
  target: T,
  onUpdate: (value: Tapped<T>) => void
): IObserver<Tapped<T>> {
  let observable = getObservable(target)
  if (observable) {
    return observable.tap(onUpdate)
  }
  throw Error('The given object is not yet observable')
}
