<img src="https://github.com/alloc/vana/raw/master/logo.png" width="260" />

# Introduction

Vana adds **observability** to normal objects without mutating their public
appearance. The only exception to that rule is that all objects are made
**immutable**. This is Vana at its core.

&nbsp;

**What does immutability do?** You get deep equality checks for the price of a
`===` check, objects are frozen and must be mutated with specialized functions.
[Read this!][what-is-immutable]

**What does observability do?** It lets you subscribe to changes in any data. In
the case of Vana, you're subscribing to future copies of an immutable state
tree (or a leaf thereof).

[what-is-immutable]: https://benmccormick.org/2016/06/04/what-are-mutable-and-immutable-data-structures-2

&nbsp;

👋 Make sure to try the **React integration!**

- Re-render your components when observed data is changed (with `useObserved`)
- Run arbitrary logic when observed data is changed (with `useObserver`)
- Create a computed value from 1+ observable values (with `useDerived`)
- Reactive memoization (with `useMemos` and `useKeyedMemos`)

### ⚛️ [Learn more](../src/react) ⚛️

&nbsp;

## Core concepts

If you want to understand Vana on a deeper level, you can read this short list
of rules that Vana follows.

### 1. Immutability is required

For its safety and cheap memoization, Vana enforces deep immutability. Any
objects given to Vana are returned with an immutable type. To avoid compiler
errors, be sure to use `readonly T[]` instead of `T[]` in your function
signatures.

### 2. Observability is transparent

Observable objects can be passed to any existing code without issue, as long as
they don't try to mutate the object. An observable object can be cloned by
passing it to the
[`o`][o]
function.

Every observable object has an `Observable` instance as its
[`$O`][$o]
property. `Observable` instances only remember the latest revision.

[o]: https://github.com/alloc/vana/blob/0af1f63b29b3c2434b11d5f014282fc07a2b95e7/src/core/o.ts#L18-L46
[$o]: https://github.com/alloc/vana/blob/0af1f63b29b3c2434b11d5f014282fc07a2b95e7/src/shared/symbols.ts#L1-L2

### 3. Observable copies are "revisions"

Observable objects are "revised" by the [`revise`][revise] and [`produce`][produce] functions.
The "revisions" are observable and immutable.

[revise]: https://github.com/alloc/vana/blob/0af1f63b29b3c2434b11d5f014282fc07a2b95e7/src/core/revise.ts#L13-L35
[produce]: https://github.com/alloc/vana/blob/0af1f63b29b3c2434b11d5f014282fc07a2b95e7/src/shared/immer.ts#L41

### 4. Observability is temporary

The first time an observable object is revised, its `Observable` instance (which
includes any observers) is stolen by the revision. This means only the latest
revision can be observed or revised. For safety, errors are thrown whenever
stale data is detected.

### 5. Observability is deep

When an object is made observable with Vana, any nested objects will also be
made observable (when possible). You can freeze a nested object to prevent it
from being observed. Deep observability is crucial for keeping track of which
immutable copy is the most recent. It also means less work for use cases that
require deep observability.

### 6. Structural sharing is used (thanks to Immer)

[Immer] lets users write [imperative] code that produces a mutated copy of any
immutable object.
[Structural sharing][ss] is used to avoid redundant cloning.

The entire API of Immer is re-exported by Vana ([see
here][immer-api]).

[immer]: https://github.com/mweststrate/immer
[immer-api]: https://github.com/alloc/vana/blob/97937b7d31c9fe2d56af5d17bf1c02bfde2db300/src/core/index.ts#L32-L33
[imperative]: https://en.wikipedia.org/wiki/Imperative_programming
[ss]: http://raganwald.com/2019/01/14/structural-sharing-and-copy-on-write.html

&nbsp;

## Rules of thumb

Here are a few rules that steer you clear of avoidable issues.

### 1. Prefer object _identifiers_ over object _references_

Once an object is referenced in multiple places, your state tree becomes a
state graph. Although Vana may work with state graphs in simple cases, it makes
no guarantees. Since Vana is not tested with state graphs, we recommend avoiding
them by using unique identifiers instead.

&nbsp;

_More rules may be added in the future._
