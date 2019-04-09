# vana

[![npm](https://img.shields.io/npm/v/vana.svg)](https://www.npmjs.com/package/vana)
[![Build status](https://travis-ci.org/alloc/vana.svg?branch=master)](https://travis-ci.org/alloc/vana)
[![codecov](https://codecov.io/gh/alloc/vana/branch/master/graph/badge.svg)](https://codecov.io/gh/alloc/vana)
[![Bundle size](https://badgen.net/bundlephobia/min/vana)](https://bundlephobia.com/result?p=vana)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/alecdotbiz)

Observe your immutable state trees. 🌲👀

### [Read the introduction.](./docs/intro.md)

## Basic usage

```ts
import { o } from 'vana'

let state = o({
  /* Any data can go here */
})
```

The returned `state` is immutable _and_ observable.

Before we make any changes, let's observe our `state` object:

```ts
import { tap } from 'vana'

// This callback is called synchronously whenever `state` changes.
tap(state, newState => {
  state = newState
})
```

The first kind of mutation passes a callback to the `revise` function. Any
changes made within the callback are used to create an immutable copy of our
`state` object.

```ts
import { revise } from 'vana'

const base = state
const copy = revise(state, draft => {
  /* Mutate our immutable state in here */
})

assert(base !== copy)
assert(copy === state) // Our `state` variable is updated.
```

The `copy` object is now observed by whoever was observing the `base` object,
and revising the `base` object is now forbidden.

The second kind of mutation passes an object to the `revise` function. This is
essentially the `Object.assign` of Vana.

```ts
const copy = revise(state, {
  /* Any data can go here */
})
```

Those are the basics. Here is a sandbox you can play with:

#### https://codesandbox.io/s/nnx8zxx03p

&nbsp;

## Integrations

- [React](https://github.com/alloc/vana-react) (recommended)

&nbsp;

## Advanced usage

Here are some advanced use cases.

### Cloning an observable object

Clone an observable object by passing it to the `o` function.

```ts
const base = o({ a: 1 })
const copy = o(base)

// The "copy" has its own observable identity.
assert(isObservable(copy))
assert(base !== copy)

// The "base" is still observable and revisable.
assert(isObservable(base))
tap(base, console.log)
revise(base, { a: 2 })
```

&nbsp;

### Controlled observables

Pass a callback to the `o` function to create a controlled observable.

```ts
// This pattern is great for memoized subscriptions.
const foo = o<number>(next => {
  next(0) // Always provide an initial value.
  let n = 0
  let id = setInterval(() => next(++n), 1000)
  return () => clearInterval(id)
})
// Log every new value.
foo.tap(console.log)
```

&nbsp;

### The `keepAlive` function

Use the `keepAlive` function to make a "living" object out of an observable object. The returned object is a mirror of the observable's current value.

```ts
import { keepAlive } from 'vana'

let initialState = o({ a: 1 })
let state = keepAlive(initialState)

revise(initialState, { a: 2 })
assert(state.a === 2)
```

&nbsp;

### Array helpers

Vana provides [an API](https://github.com/alloc/vana/blob/master/src/array.ts) for array operations:

```ts
import { append, prepend, insert, concat, remove } from 'vana/lib/array'

// Append one or more values to a copy of the given array.
append(arr, ...values)

// Prepend one or more values to a copy of the given array.
prepend(arr, ...values)

// Insert one or more values into a copy of the given array.
insert(arr, index, ...values)

// Merge one or more arrays into a copy of the given array.
concat(arr, ...values)

// Remove one or more values from a copy of the given array.
remove(arr, index, (count = 1))
```

&nbsp;

_TODO: Provide more advanced use cases_
