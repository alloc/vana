export { o } from './funcs/o'
export { tap, Tapped } from './funcs/tap'
export { watch, WatchProxy } from './funcs/watch'
export { revise } from './funcs/revise'
export { Domain } from './types/Domain'
export { Observable, isObservable, getObservable } from './types/Observable'

export {
  Draft,
  Recipe,
  Immutable,
  produce,
  nothing,
  isDraft,
  original,
  applyPatches,
  setUseProxies,
  setAutoFreeze,
} from './immer'

export { freeze, Frozen } from './funcs/freeze'
export { Disposable, IDisposable, IThenable } from './common'
