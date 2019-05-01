# vana/lib/react

Helpers for `vana` in `react`

&nbsp;

### useO

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

### useObserved

```ts
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

### useObserver

```ts
useObserver(props.obj, obj => {
  console.log('changed:', obj)
})
```

&nbsp;

### useDerived

```ts
const c = useDerived((a, b) => a + b, [props.a, props.b])
```

&nbsp;

### useMemos

```tsx
const arr = useMemos(props.items, item => <View>{item}</View>)
```

&nbsp;

### useKeyedMemos

```tsx
const arr = useKeyedMemos(
  props.items,
  item => item.key,
  item => <View>{item}</View>
)
```

&nbsp;
