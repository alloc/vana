// tslint:disable:variable-name
import { isDraft, isDraftable } from 'immer'
import { $O, definePrivate, Dictionary, isObject, shallowCopy } from '../shared'
import { Change } from './Change'
import { commit } from './commit'
import { freeze, isFrozen } from './freeze'
import { getObservable, Observable } from './Observable'

/** An observable object with observable properties */
export class OProps<T extends Dictionary<any> = any> extends Observable<T> {
  watched?: Dictionary<OProp<T>>

  constructor(source: Exclude<T, Function>) {
    super(source)
  }

  watch<P extends string | number>(prop: P): OProp<T, P> {
    const watched = this.watched || (this.watched = Object.create(null))
    return watched[prop] || (watched[prop] = new OProp<T, P>(this, prop))
  }

  /** @internal */
  ['_onChange'](change: Change<T>) {
    // The target is either this or an OProp object whose value is observable.
    if (change.target !== this) {
      const currProps = this.get()

      // When a change is from Immer, we must check if its state (or its parent state)
      // is related to us. If so, Immer will update our underlying value for us.
      if (change.state) {
        const { copy, parent } = change.state
        if (copy == currProps) return
        // Check against `parent.base` instead of `parent.copy` because changes
        // are processed from bottom-to-top, which means our underlying value
        // has not been updated yet when we are the parent of this change.
        if (parent && parent.base == currProps) return
      }

      const target = change.target as OProp<T>
      const nextProps = shallowCopy(currProps)
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

    // Property changes are handled before notifying root observers.
    else if (change.prop !== null) {
      const { prop, oldValue, newValue } = change

      // Ensure the new value is observable if it can be.
      const oldObservable = oldValue && oldValue[$O]
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

      // Notify any property observers.
      if (this.watched) {
        const target = this.watched[prop]
        if (target) {
          commit(target, oldValue, newValue, null, false, change.state)
        }
      }
    }

    // Notify any root observers.
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
    }
    // Changes to `_observedValue` are first handled by our parent.
    else if (change.prop === null) {
      this.parent._onChange({ ...change, target: this })
    }
  }

  protected activate() {
    // Already active if the value is observable.
    if (!this._observedValue) {
      const watched = this.parent.watched!
      const target = watched[this.prop]
      if (!target) {
        watched[this.prop] = this
      } else if (target !== this) {
        // Never store an OProp longer than you need to.
        throw Error('Cannot observe an old observable')
      }
    }
  }

  protected deactivate() {
    // Skip deactivation unless the value is *not* observable.
    // Otherwise, deep observability is prevented.
    if (!this._observedValue) {
      delete this.parent.watched![this.prop]
    }
  }

  private _observeValue(value: T[P]) {
    // Avoid throwing on stale values.
    const observed = value && value[$O]
    if (observed) {
      if (observed !== this._observedValue) {
        if (this._observedValue) {
          this._observedValue._removeObserver(this)
        }
        if (!this._observers) {
          this.activate()
        }
        observed._addObserver(this, true)
        this._observedValue = observed
      }
    } else if (this._observedValue) {
      this._observedValue._removeObserver(this)
      this._observedValue = undefined

      if (!this._observers) {
        this.deactivate()
      }
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
      const value = parent[prop]
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
