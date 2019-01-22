/* tslint:disable:unified-signatures */
import { definePrivate, isThenable, IThenable, noop } from '../common'
import { commit } from '../funcs/commit'
import { freeze } from '../funcs/freeze'
import { __$observable, getObservable, Observable } from './Observable'

export type PromiseState<T = any> =
  | PendingState
  | FulfilledState<T>
  | RejectedState

export type PendingState = {
  readonly resolved: false
}

export type FulfilledState<T = any> = {
  readonly resolved: true
  readonly result: T
  readonly error: undefined
}

export type RejectedState = {
  readonly resolved: true
  readonly result: undefined
  readonly error: Error
}

export type PromiseResolver<T = any> = (
  resolve: (result: T | IThenable<T>) => void,
  reject: (error: Error) => void
) => void

const freezeState = freeze as <T = any>(
  state: PromiseState<T>
) => PromiseState<T>

const PENDING = freezeState({ resolved: false })

export class OPromise<T = any> extends Observable<PromiseState<T>> {
  private _state: PromiseState<T>

  constructor(resolver?: PromiseResolver<T>) {
    super(() => this._state)
    this._state = PENDING
    if (resolver) {
      try {
        resolver(this.resolve.bind(this), this.reject.bind(this))
      } catch (e) {
        this.reject(e)
      }
    }
  }

  resolve<T>(result: IThenable<T>): void
  resolve<T>(result: T): void
  resolve(result: any) {
    if (this._state !== PENDING) return
    if (isThenable(result)) {
      // Create our own pending state to prevent other `resolve` and `reject` calls.
      this._state = freezeState({ resolved: false })
      result
        .then(this._fulfill.bind(this), this._reject.bind(this))
        .then(noop, console.error) // tslint:disable-line
    } else {
      this._fulfill(result)
    }
  }

  reject(error: any) {
    if (this._state === PENDING) {
      this._reject(error)
    }
  }

  /** @internal */
  ['_isCurrent'](value: any) {
    // OPromise instances are never bound to more than one Promise.
    return value && value[__$observable] === this
  }

  static resolve<T>(result: IThenable<T>): OPromise<T>
  static resolve<T>(result: T): OPromise<T>
  /** Create a promise and resolve it immediately */
  static resolve(result: any) {
    let p = new OPromise()
    p.resolve(result)
    return p
  }

  private _fulfill(result: T) {
    this._state = freezeState({ resolved: true, result, error: undefined })
    commit(this, PENDING, this._state)
  }

  private _reject(error: Error) {
    this._state = freezeState<T>({ resolved: true, result: undefined, error })
    commit(this, PENDING, this._state)
  }
}

/** @internal */
export function bindPromise<T>(promise: IThenable<T>) {
  let observable = getObservable(promise)
  if (!observable) {
    observable = OPromise.resolve(promise)
    definePrivate(promise, __$observable, observable)
  }
  return observable
}
