import { IDisposable, isFunction } from '../shared'
import { Observable } from './Observable'

export type Driver<T = any> = (
  next: (value: T) => void
) => IDisposable | (() => void) | void

/**
 * An observable sink that binds to an event stream.
 *
 * The binding is lazy, which means no value exists until observed.
 *
 * The current value is always `undefined` when no observers exist.
 */
export class OSink<T = any> extends Observable<T> {
  private _binding?: IDisposable

  constructor(public driver: Driver<T>) {
    super(undefined as any)
  }

  protected activate() {
    const result = this.driver(newValue => this.set(newValue, true))
    if (result) {
      this._binding = isFunction(result) ? { dispose: result } : result
    }
  }

  protected deactivate() {
    this._value = undefined
    if (this._binding) {
      this._binding.dispose()
      this._binding = undefined
    }
  }
}
