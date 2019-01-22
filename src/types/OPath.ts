import { AnyProp, Dictionary, isPlainObject } from '../common'
import { Change } from '../funcs/commit'
import { getObservable, isObservable, Observable } from './Observable'

/**
 * An observable property whose ancestors are also observed. The property value
 * is deeply observed when possible.
 */
export class OPath<T = any> extends Observable<T> {
  private _changed: boolean = false
  private _lastParent?: object = undefined
  private _observedValue?: Observable<T> = undefined
  private _observedParents?: Array<Observable<object>> = undefined

  constructor(
    readonly root: Observable<object>,
    readonly path: ReadonlyArray<AnyProp>
  ) {
    super(() => {
      if (this._lastParent) {
        return this._lastParent[path[path.length - 1]]
      }
    })
  }

  watch<P extends WatchableKeys<T>>(prop: P) {
    type U = P extends keyof T ? T[P] : never
    return new OPath<U>(this.root, this.path.concat(prop))
  }

  /** @internal By the time this is called, freshness is guaranteed. */
  ['_isCurrent']() {
    return true
  }

  /** @internal */
  ['_onChange'](change: Change<T | object>) {
    let { prop } = change
    if (!this._changed) {
      // The target is either a parent object or the property value.
      let index = this._observedParents!.indexOf(change.target as any)
      let changed =
        index >= 0
          ? prop === this.path[index]
          : prop === null && change.target === this._observedValue

      if (changed) {
        this._changed = index < 0 || this.get() !== this._evaluatePath(index)
      }
    }
    // The path is re-observed once the root object is notified of the change.
    else if (prop === null && change.target === this.root) {
      this._changed = false

      let oldValue = this.get()
      this._observePath()

      super._onChange({
        target: this,
        oldValue,
        newValue: this.get(),
        prop: null,
        deleted: false,
        state: null,
      })
    }
  }

  protected activate() {
    this._observePath()
  }

  protected deactivate() {
    if (this._observedParents) {
      this._observedParents.forEach(p => p._removeObserver(this))
      this._observedParents = undefined
    }
    if (this._observedValue) {
      this._observedValue._removeObserver(this)
      this._observedValue = undefined
    }
  }

  private _evaluatePath(fromIndex: number) {
    let last = this.path.length - 1
    let parent = this._observedParents![fromIndex].get()
    for (let i = fromIndex; i <= last; i++) {
      let value = parent[this.path[i]]
      if (i == last) {
        return value
      }
      if (!isPlainObject(value)) {
        return // Evaluation failed.
      }
      parent = value
    }
  }

  private _observePath() {
    if (!this.path.length) {
      throw Error('Observable path cannot be empty')
    }

    if (this._observedParents) {
      this._observedParents.forEach(p => p._removeObserver(this))
      this._observedParents.length = 0
    } else {
      this._observedParents = []
    }

    let parent = this.root.get()
    this._observeParent(parent)

    let last = this.path.length - 1
    for (let i = 0; i < last; i++) {
      let value = parent[this.path[i]]
      if (!isPlainObject(value)) {
        this._lastParent = undefined
        return
      }
      parent = value
      this._observeParent(parent)
    }

    this._lastParent = parent
    this._observeValue(this.get())
  }

  private _observeParent(parent: object) {
    let target = getObservable(parent)
    if (target) {
      target._addObserver(this)
      this._observedParents!.push(target)
    } else {
      throw Error('Parent must be observable')
    }
  }

  private _observeValue(value: T) {
    let observed = this._observedValue
    if (observed) {
      observed._removeObserver(this)
    }
    // Avoid throwing on stale values.
    if (isObservable(value)) {
      observed = getObservable(value)!
      observed._addObserver(this)
      this._observedValue = observed
    } else if (observed) {
      this._observedValue = undefined
    }
  }
}

// Object types whose properties cannot be watched.
type NotSupported =
  | ReadonlyArray<any>
  | Set<any>
  | Map<any, any>
  | Promise<any>
  | Date

type WatchableKeys<T> = Exclude<T, NotSupported> extends Dictionary<any>
  ? keyof Exclude<T, NotSupported>
  : never
