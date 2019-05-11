<img src="https://github.com/alloc/vana/raw/master/vana.png" width="260" />

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

#### https://codesandbox.io/s/z33pzx31wp

#### https://github.com/alloc/vana-sandbox

&nbsp;

## Install

```
yarn add vana
```

&nbsp;

## Integrations

- [React](./src/react/README.md) (recommended)

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

### The `latest` function

Give any value and receive the latest revision (if possible), else return it as-is.

```ts
const o1 = o({ foo: true })
const o2 = revise(o1, { foo: false })
const o3 = revise(o2, { foo: true })

assert(o1 !== o3)
assert(latest(o1) === o3)

// Trash in, trash out
assert(latest(1) === 1)
```

&nbsp;

### The `keepAlive` function

Use the `keepAlive` function to make a "living" object out of an observable object. The returned object is a mirror of the observable's current value.

```ts
import { keepAlive } from 'vana'

let initialState = o({ a: 1 })
let state = keepAlive(initialState)

// The latest revision is always reflected
const lastState = revise(initialState, { a: 2 })
assert(state.a === 2)

// Can be passed to `latest`
assert(latest(state) === lastState)

// Be sure to call dispose when appropriate
state.dispose()
```

&nbsp;

### The `watch` function

This function lets you watch any property path in a state tree.

```ts
import { watch } from 'vana'

// An observable that updates when `obj.a.b.c` is changed
const prop = watch(obj).a.b.c

// Run a function when the property value is changed
const observer = prop.tap(console.log)

// Get the current property value
prop.get()

// Shallow properties can be observed more efficiently
const prop = watch(obj, 'a')

// You can use a selector function if you want
const prop = watch(obj, obj => obj.a.b.c)
```

Every property in the path is observed.

The property value is deeply observed if possible.

&nbsp;

### Array helpers

These functions are for working with immutable arrays. Each function works for
any array regardless of mutability. They always return a modified copy of the
given array (or the given array if no changes were made).

```ts
import { append, prepend, insert, concat, remove } from 'vana'

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

### Custom immutable classes

Any class can be made compatible with Vana's cloning logic.

```ts
import { immerable, o, revise, keepAlive, latest } from 'vana'

class Foo {
  readonly bar: number = 0

  // Let `Foo` instances be assumed readonly
  static [immerable] = true

  // Mutate yourself with `revise`
  setBar(bar: number) {
    return revise(this, { bar })
  }
}

let foo = o(new Foo())
assert(Object.isFrozen(foo))
assert(foo.bar === 0)

foo = foo.setBar(1)
assert(foo.bar === 1)

// works with `keepAlive`
const fooLatest = keepAlive(foo)

const foo3 = foo.setBar(2)
assert(foo3 !== foo)
assert(foo3.bar === 2)
assert(fooLatest.bar === 2)

// and with `latest`
foo = latest(foo)
assert(foo === foo3)
```

&nbsp;

_TODO: Provide more advanced use cases_
