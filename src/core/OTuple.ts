import { AnyArray } from '../shared'
import { IChangeTarget } from './Change'
import { Observable } from './Observable'

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
    super(source.map(unwrap) as any)
    this._source = source
  }

  /** @internal */
  ['_onChange']() {
    let oldValue = this.get()
    let newValue = this._source.map(unwrap) as any
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
      let target = Observable.from(elem)
      if (target && targets.indexOf(target) < 0) {
        target['_addObserver'](this)
        targets.push(target)
      }
    })
  }

  protected deactivate() {
    this._source.forEach(elem => {
      let target = Observable.from(elem)
      if (target) {
        target['_removeObserver'](this)
      }
    })
  }
}

function unwrap(value: any) {
  const target = Observable.from(value)
  return target ? target.get() : value
}
