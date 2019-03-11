import { o, revise, watch } from '../src'
import { append, concat, insert, prepend, remove } from '../src/array'
import { $O } from '../src/symbols'
import { Change, Observable } from '../src/types'

describe('Watching arrays:', () => {
  it('can watch an index', () => {
    let arr = o([1])
    let slot = watch(arr, 0)
    let changes = trackChanges(slot)
    arr = revise(arr, arr => {
      arr[0] = 2
    })
    revise(arr, arr => {
      arr.pop()
    })
    expect(changes).toMatchSnapshot()
  })

  it('can watch the length property', () => {
    let arr = o([1])
    let slot = watch(arr, 'length')
    let changes = trackChanges(slot)
    arr = revise(arr, arr => {
      arr.push(2, 3)
    })
    revise(arr, arr => {
      arr.length = 0
    })
    expect(changes).toMatchSnapshot()
  })
})

describe('Array helpers:', () => {
  describe('append()', () => {
    it('emits proper changes', () => {
      let arr = o([0])
      let changes = trackChanges(arr)
      append(arr, 1, 2)
      expect(changes).toMatchSnapshot()
    })

    it('ensures nested objects are observable', () => {
      let arr = o<any[]>([])
      arr = append(arr, {})
      expect(arr[0][$O]).toBeDefined()
    })
  })

  describe('prepend()', () => {
    it('emits proper changes', () => {
      let arr = o([0])
      let changes = trackChanges(arr)
      prepend(arr, 1, 2)
      expect(changes).toMatchSnapshot()
    })

    it('ensures nested objects are observable', () => {
      let arr = o<any[]>([])
      arr = prepend(arr, {})
      expect(arr[0][$O]).toBeDefined()
    })
  })

  describe('insert()', () => {
    it('emits proper changes', () => {
      let arr = o([1, 4])
      let changes = trackChanges(arr)
      insert(arr, 1, 2, 3)
      expect(changes).toMatchSnapshot()
    })

    it('ensures nested objects are observable', () => {
      let arr = o<any[]>([])
      arr = insert(arr, 0, {})
      expect(arr[0][$O]).toBeDefined()
    })
  })

  describe('concat()', () => {
    it('emits proper changes', () => {
      let arr = o([1])
      let changes = trackChanges(arr)
      concat(arr, [2, 3], 4)
      expect(changes).toMatchSnapshot()
    })

    it('ensures nested objects are observable', () => {
      let arr = o<any[]>([])
      arr = concat(arr, {})
      expect(arr[0][$O]).toBeDefined()
    })
  })

  describe('remove()', () => {
    it('emits proper changes', () => {
      let arr = o([1, 2, 3, 4])
      let changes = trackChanges(arr)
      remove(arr, 1, 2)
      expect(changes).toMatchSnapshot()
    })
  })
})

describe('Revising an array:', () => {
  it('ensures nested objects are observable', () => {
    let arr = o<any[]>([])
    arr = revise(arr, arr => {
      arr.push({})
    })
    expect(arr[0][$O]).toBeDefined()
  })

  describe('push()', () => {
    it('emits proper changes', () => {
      let arr = o([0])
      let changes = trackChanges(arr)
      revise(arr, arr => {
        arr.push(1, 2)
      })
      expect(changes).toMatchSnapshot()
    })
  })

  describe('unshift()', () => {
    it('emits proper changes', () => {
      let arr = o([0])
      let changes = trackChanges(arr)
      revise(arr, arr => {
        arr.unshift(1, 2)
      })
      expect(changes).toMatchSnapshot()
    })
  })

  describe('splice()', () => {
    it('emits proper changes', () => {
      let arr = o([0, 1, 2, 3, 4, 5])
      let changes = trackChanges(arr)
      revise(arr, arr => {
        arr.splice(3, 2, 0)
        arr.splice(1, 2, 0)
      })
      expect(changes).toMatchSnapshot()
    })
  })
})

function trackChanges(obj: any) {
  const changes: object[] = []
  Observable.from(obj)!._addObserver({
    _onChange(change: Change) {
      changes.push({
        prop: change.prop,
        oldValue: change.oldValue,
        ...(change.deleted ? { deleted: true } : { newValue: change.newValue }),
      })
    },
  })
  return changes
}
