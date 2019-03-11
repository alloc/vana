import { AnyArray } from './common'
import { become } from './funcs/become'

export function append<T>(
  base: ReadonlyArray<T>,
  first: T,
  ...rest: T[]
): typeof base

export function append(base: AnyArray, ...values: any[]) {
  const copy = base.slice()
  copy.push(...values)
  return become(base, copy)
}

export function prepend<T>(
  base: ReadonlyArray<T>,
  first: T,
  ...rest: T[]
): typeof base

export function prepend(base: AnyArray, ...values: any[]) {
  return become(base, values.concat(base))
}

export function insert<T>(
  base: ReadonlyArray<T>,
  index: number,
  first: T,
  ...rest: T[]
): typeof base

export function insert(base: AnyArray, index: number, ...values: any[]) {
  return become(base, base.slice(0, index).concat(values, base.slice(index)))
}

export function concat<T>(
  base: ReadonlyArray<T>,
  first: Exclude<T, AnyArray> | ReadonlyArray<T>,
  ...rest: Array<typeof first>
): typeof base

export function concat(base: AnyArray, ...values: any[]) {
  const copy = base.concat(...values)
  return copy.length == base.length ? base : become(base, copy)
}

export function remove<T>(
  base: ReadonlyArray<T>,
  index: number,
  count: number = 1
): typeof base {
  if (count > 0 && index < base.length && index + count > 0) {
    const copy =
      index <= 0
        ? base.slice(index + count)
        : index + count >= base.length
        ? base.slice(0, index)
        : base.slice(0, index).concat(base.slice(index + count))

    if (copy.length !== base.length) {
      return become(base, copy)
    }
  }
  return base
}
