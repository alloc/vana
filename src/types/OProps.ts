// tslint:disable:variable-name
import { isDraft, isDraftable } from 'immer'
import { definePrivate, Dictionary, isObject, shallowCopy } from '../common'
import { commit } from '../funcs/commit'
import { freeze, isFrozen } from '../funcs/freeze'
import { $O } from '../symbols'
import { Change } from './Change'
import { getObservable, Observable } from './Observable'

/** An observable object with observable properties */
export class OProps<T extends Dictionary<any> = any> extends Observable<T> {
  watched?: Dictionary<OProp<T>>

  constructor(source: Exclude<T, Function>) {
    super(source)
  }

  watch<P extends string | number>(prop: P): OProp<T, P> {
    let watched = this.watched || (this.watched = Object.create(null))
    return watched[prop] || (watched[prop] = new OProp<T, P>(this, prop))
  }

  /** @internal */
  ['_onChange'](change: Change<T>) {
    // When a property has an observable value, it notifies us of changes using
    // itself as the target.
    if (change.target !== this) {
      let currProps = this.get()

      // When a change is from Immer, we must check if its state (or its parent state)
      // is related to us. If so, Immer will update our underlying value for us.
      if (change.state) {
        let { copy, parent } = change.state
        if (copy == currProps) return
        // Check against `parent.base` instead of `parent.copy` because changes
        // are processed from bottom-to-top, which means our underlying value
        // has not been updated yet when we are the parent of this change.
        if (parent && parent.base == currProps) return
      }

      let target = change.target as OProp<T>
      let nextProps = shallowCopy(currProps)
      nextProps[target.prop] = change.newValue

      // Bind `this` to its next value.
      definePrivate(nextProps, $O, this)
      this._rebind(nextProps)
      freeze(nextProps)

      // Reuse the change object, since only we receive it.
      change.target = this
      change.prop = target.prop
      this._onChange(change)

      // Reuse it again for the root change.
      change.prop = null
      change.oldValue = currProps
      change.newValue = nextProps
    }

    // Notify property observers first.
    else if (change.prop !== null) {
      let { prop, oldValue, newValue } = change

      let oldObservable = oldValue && oldValue[$O]
      if (newValue) {
        let observable = getObservable(newValue)

        // Plain objects/arrays are made observable automatically.
        if (!observable && !isFrozen(newValue) && isDraftable(newValue)) {
          observable = bindProps(newValue)
        }

        // Always watch any property that has an observable value.
        if (observable && !oldObservable) {
          this.watch(prop)
        }
      }

      if (this.watched) {
        let target = this.watched[prop]
        if (target) {
          commit(target, oldValue, newValue, null, false, change.state)
        }
      }
    }

    // Notify root observers.
    super._onChange(change)
  }
}

export class OProp<
  T extends Dictionary<any> = any,
  P extends string | number = any
> extends Observable<T[P]> {
  /** Exists when the observed property name has an observable value */
  private _observedValue?: Observable<T[P]> = undefined

  constructor(readonly parent: OProps<T>, readonly prop: P) {
    super(() => parent.get()[prop])
    this._observeValue(this.get())
  }

  /** @internal */
  ['_onChange'](change: Change<T[P]>) {
    if (change.target === this) {
      this._observeValue(change.newValue)
      super._onChange(change)
      if (!this._observedValue) {
        this._safeDispose()
      }
    }
    // Changes to `_observedValue` are first handled by our parent.
    else if (change.prop === null) {
      this.parent._onChange({ ...change, target: this })
    }
  }

  /** @internal Dispose only if no observers exist */
  ['_safeDispose']() {
    if (!this._observers) {
      this.dispose()
    }
  }

  protected activate() {
    if (!this._observedValue) {
      this._observeValue(this.get())
    }
    // Ensure this instance can receive changes.
    this.parent.watched![this.prop] = this
  }

  protected deactivate() {
    if (this._observedValue) {
      this._observedValue._removeObserver(this)
      this._observedValue = undefined
    }
    // Ensure this instance can be garbage collected.
    delete this.parent.watched![this.prop]
  }

  private _observeValue(value: T[P]) {
    // Avoid throwing on stale values.
    let observed = value && value[$O]
    if (observed) {
      if (observed !== this._observedValue) {
        if (this._observedValue) {
          this._observedValue._removeObserver(this)
        }
        observed._addObserver(this, true)
        this._observedValue = observed
      }
    } else if (this._observedValue) {
      this._observedValue._removeObserver(this)
      this._observedValue = undefined
    }
  }
}

export function bindProps<T extends object>(root: Exclude<T, Function>) {
  if (isFrozen(root)) {
    throw Error('Frozen objects cannot become observable')
  }
  if (isDraft(root)) {
    throw Error('Immer drafts cannot become observable')
  }
  if (!isDraftable(root)) {
    throw Error('This object has no observable type')
  }

  const rootObservable = new OProps(root)
  definePrivate(root, $O, rootObservable)

  const observeTree = (parent: object, observer: OProps) => {
    // Only enumerable keys are made observable.
    Object.keys(parent).forEach(prop => {
      let value = parent[prop]
      if (isObject(value)) {
        let observable = getObservable(value) as OProps
        if (!observable) {
          if (isFrozen(value) || !isDraftable(value)) return
          observable = new OProps(value)
          definePrivate(value, $O, observable)
          observeTree(value, observable)
        }
        // To support deep observation, any property with an
        // observable value must be watched.
        observer.watch(prop)
      }
    })
    freeze(parent)
  }

  // The entire state tree is made observable (when possible).
  observeTree(root, rootObservable)
  return rootObservable
}
