import { Domain, isObservable, revise } from '../src'

interface User {
  readonly id: number
  name: string
}

describe('new Domain()', () => {
  it('always has the latest version of objects added to it', () => {
    let users = new Domain<User>('id')
    let paul = { id: 1, name: 'Paul' }
    users.add(paul)

    let paula = revise(paul, { name: 'Paula' })
    expect(users.get(1)).toBe(paula)
    expect(isObservable(paul)).toBeFalsy()
  })

  describe('reset() method', () => {
    it('can be passed an array of objects', () => {
      let users = new Domain<User>('id')
      let input = [{ id: 1, name: 'Paul' }, { id: 2, name: 'Ringo' }]
      users.reset(input)
      expect(users.get(1)).toBe(input[0])
      expect(users.get(2)).toBe(input[1])
    })

    it('can be passed a map of objects', () => {
      let users = new Domain<User>('id')
      let input = { 1: { id: 1, name: 'Paul' }, 2: { id: 2, name: 'Ringo' } }
      users.reset(input)
      expect(users.get(1)).toBe(input[1])
      expect(users.get(2)).toBe(input[2])
    })
  })
})
