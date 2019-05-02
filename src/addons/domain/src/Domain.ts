import { $O, Change, IObserver, o } from '../../../core'
import { Dictionary, isArray } from '../../../shared'

/**
 * The `Domain` class ensures every object it contains is always the latest revision.
 *
 * Domains are __mutable__.
 */
export class Domain<T extends object = any> implements IObserver<T> {
  private data: Dictionary<T>

  constructor(readonly key: string | number) {
    this.data = Object.create(null)
  }

  get(key: string | number): T | undefined {
    return this.data[key]
  }

  add(value: T) {
    let key = value[this.key]
    if (key == null) {
      throw Error(`The "${this.key}" property must exist`)
    }

    if (this.data[key]) {
      return false
    }

    let observable = value[$O] || o(value)[$O]
    if (!observable) {
      throw Error('This object has no observable type')
    }

    observable._addObserver(this)
    this.data[key] = value
    return true
  }

  delete(key: any) {
    let value = this.data[key]
    if (value) {
      delete this.data[key]
      value[$O]._removeObserver(this)
      return true
    }
    return false
  }

  /** Replace the existing set of objects. */
  reset(data: Dictionary<T> | T[]) {
    this.dispose()
    this.data = Object.create(null)
    if (isArray(data)) {
      data.forEach(value => this.add(value))
    } else {
      for (let key in data) this.add(data[key]!)
    }
  }

  /** Stop observing all objects within this domain. */
  dispose() {
    for (let key in this.data) {
      this.data[key]![$O]._removeObserver(this)
    }
  }

  /** @internal */
  ['_onChange'](change: Change<T>) {
    if (change.prop == null) {
      let key: any = change.newValue[this.key]
      if (key == null) {
        throw Error(`The "${this.key}" property must exist`)
      }

      if (key !== this.data[key]![this.key]) {
        throw Error(`The "${this.key}" property must be constant`)
      }

      this.data[key] = change.newValue
    }
  }
}
