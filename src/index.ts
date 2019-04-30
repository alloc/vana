export { o } from './funcs/o'
export { tap, Tapped } from './funcs/tap'
export { watch, WatchProxy } from './funcs/watch'
export { revise } from './funcs/revise'
export { latest } from './funcs/latest'
export { keepAlive } from './funcs/keepAlive'
export {
  Observable,
  IObserver,
  isObservable,
  getObservable,
} from './types/Observable'

// Immer exports
export { Draft, Immutable, isDraft, nothing, original, immerable } from 'immer'
export { Recipe, produce, setUseProxies, setAutoFreeze } from './immer'

// Common exports
export { freeze, Frozen } from './funcs/freeze'
export { Disposable, IDisposable, IThenable } from './common'
