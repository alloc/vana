import { AnyArray } from './common'
import { become } from './funcs/become'
import { commitIndices } from './funcs/commitIndices'
import { commitLength } from './funcs/commitLength'

export function append<T extends AnyArray>(
  base: T,
  first: T[number],
  ...rest: Array<T[number]>
): T

export function append(base: AnyArray, ...values: any[]) {
  const copy = base.slice()
  copy.push(...values)
  if (become(base, copy)) {
    commitIndices(base, copy, base.length, values.length)
    commitLength(base, copy)
  }
  return copy
}

export function prepend<T extends AnyArray>(
  base: T,
  first: T[number],
  ...rest: Array<T[number]>
): T

export function prepend(base: AnyArray, ...values: any[]) {
  const copy = values.concat(base)
  if (become(base, copy)) {
    commitIndices(base, copy, 0, copy.length)
    commitLength(base, copy)
  }
  return copy
}

export function insert<T extends AnyArray>(
  base: T,
  index: number,
  first: T[number],
  ...rest: Array<T[number]>
): T

export function insert(base: AnyArray, index: number, ...values: any[]) {
  const copy = base.slice(0, index).concat(values, base.slice(index))
  if (become(base, copy)) {
    commitIndices(base, copy, index, copy.length - index)
    commitLength(base, copy)
  }
  return copy
}

export function concat<T extends AnyArray>(
  base: T,
  first: Exclude<T[number], AnyArray> | T,
  ...rest: Array<typeof first>
): T

export function concat(base: AnyArray, ...values: any[]) {
  const copy = base.concat(...values)
  const delta = copy.length - base.length
  if (delta == 0) {
    return base
  }
  if (become(base, copy)) {
    commitIndices(base, copy, base.length, delta)
    commitLength(base, copy)
  }
  return copy
}

export function remove<T extends AnyArray>(
  base: T,
  index: number,
  count: number = 1
): T {
  if (count <= 0 || index >= base.length || index + count <= 0) {
    return base
  }

  const copy: any =
    index <= 0
      ? base.slice(index + count)
      : index + count >= base.length
      ? base.slice(0, index)
      : base.slice(0, index).concat(base.slice(index + count))

  if (become(base, copy)) {
    commitIndices(base, copy, index, base.length - index)
    commitLength(base, copy)
  }
  return copy
}
