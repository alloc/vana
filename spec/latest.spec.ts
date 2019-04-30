import { latest, o, revise } from '../src'

describe('latest', () => {
  it('returns the newest revision ', () => {
    const o1 = o({ a: 1 })
    const o2 = revise(o1, { a: 2 })
    const o3 = revise(o2, { a: 3 })
    expect(latest(o1)).toBe(o3)
    expect(latest(o2)).toBe(o3)
    expect(latest(o3)).toBe(o3)
  })

  it('is a no-op for non-observable values', () => {
    const values = [1, '', {}, [], () => {}, null, undefined]
    values.forEach(value => {
      expect(latest(value)).toBe(value)
    })
  })
})
