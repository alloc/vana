# vana/lib/react

Helpers for `vana` in `react`

&nbsp;

## useO

Create an observable value and memoize it.

The latest revision is always returned.

Pass a function to create an observable event.

```ts
import { useO } from 'vana'

// The latest revision on every render.
const data = useO({ a: 1 })

// Pass an observable value to clone it.
const clone = useO(data)

// Create an observable value from a generator (like an event or promise).
const windowSize = useO(next => {
  const onResize = () => {
    next({ width: window.innerWidth, height: window.innerHeight })
  }
  onResize()
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
})
```

&nbsp;

## useObserved

Deeply observe an object (or property) and re-render whenever it changes.

```ts
import { useObserved } from 'vana'

// Observe an object
const foo = useObserved(props.obj)

// Observe a property
const bar = useObserved(props.obj, 'bar')

// Observe an array
const arr = useObserved(props.arr)

// Observe an array index
const first = useObserved(props.arr, 0)

// Observe the length of an array
const len = useObserved(props.arr, 'length')
```

&nbsp;

## useObserver

Attach an observer to an observable value.

```ts
import { useObserver } from 'vana'

useObserver(props.obj, obj => {
  console.log('changed:', obj)
})
```

&nbsp;

## useDerived

Derive a value from the given inputs.

Each input is observed if possible.

Re-render when the computed value changes.

```ts
import { useDerived } from 'vana'

const c = useDerived((a, b) => a + b, [props.a, props.b])
```

&nbsp;

## useMemos

Memoize an array of anything.

The given array is observed if possible.

```tsx
import { useMemos } from 'vana'

const arr = useMemos(props.items, item => <View>{item}</View>)
```

**Note:** To avoid resetting the internal cache, you must wrap the function
argument with the
`useCallback` hook.

&nbsp;

## useKeyedMemos

For each item, memoize the return value of the 2nd function with the key
returned by the 1st function.

Each memoized value lasts until its item is removed from the array.

The given array is observed if possible.

```tsx
import { useKeyedMemos } from 'vana'

const arr = useKeyedMemos(
  props.items,
  item => item.key,
  item => <View>{item}</View>
)
```

**Note:** To avoid resetting the internal cache, you must wrap the function
arguments with the
`useCallback` hook.

&nbsp;
