# vana

[![npm](https://img.shields.io/npm/v/vana.svg)](https://www.npmjs.com/package/vana)
[![Build status](https://travis-ci.org/alloc/vana.svg?branch=master)](https://travis-ci.org/alloc/vana)
[![codecov](https://codecov.io/gh/alloc/vana/branch/master/graph/badge.svg)](https://codecov.io/gh/alloc/vana)
[![Bundle size](https://badgen.net/bundlephobia/min/vana)](https://bundlephobia.com/result?p=vana)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/alecdotbiz)

Observe your immutable state trees. 🌲👀

[Read the introduction.](./docs/intro.md)

## The Basics

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
https://codesandbox.io/s/nnx8zxx03p

Using `vana` with `react` is easy:
https://github.com/alloc/vana-react
