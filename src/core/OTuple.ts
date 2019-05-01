import { $O, AnyArray, isObject } from '../shared'
import { IChangeTarget } from './Change'
import { getObservable, Observable } from './Observable'

export type ObservedTuple<T extends AnyArray> = {
  [P in keyof T]: T[P] extends Observable<infer U> ? U : T[P]
}

/**
 * Observable tuples are **atomic units** and they _never_ change in length.
 * They observe every element in their source array. Non-observable elements are
 * _never_ made observable.
 */
export class OTuple<T extends AnyArray> extends Observable<ObservedTuple<T>> {
  private _source: T

  constructor(source: T) {
    super(source.map(toValue) as any)
    this._source = source
  }

  /** @internal */
  ['_onChange']() {
    let oldValue = this.get()
    let newValue = this._source.map(toLastValue) as any
    this._value = newValue
    super._onChange({
      target: this,
      oldValue,
      newValue,
      prop: null,
      deleted: false,
      state: null,
    })
  }

  protected activate() {
    let targets: IChangeTarget[] = []
    this._source.forEach(elem => {
      let target = getTarget(elem)
      if (target && targets.indexOf(target) < 0) {
        target['_addObserver'](this)
        targets.push(target)
      }
    })
  }

  protected deactivate() {
    this._source.forEach(elem => {
      let target = getTarget(elem)
      if (target) {
        target['_removeObserver'](this)
      }
    })
  }
}

function getTarget(value: any): Observable | null {
  if (value instanceof Observable) return value
  return (value && value[$O]) || null
}

function toValue(value: any) {
  if (value instanceof Observable) {
    return value.get()
  }
  let target = isObject(value) ? getObservable(value) : null
  return target ? target.get() : value
}

// Like `toValue` but tolerant of old revisions
function toLastValue(value: any) {
  if (value instanceof Observable) {
    return value.get()
  }
  let target = value && value[$O]
  return target ? target.get() : value
}
