# Introduction

Enjoy the power of [transparent](https://stackoverflow.com/a/17385138/2228559) [subscriptions](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) without losing the speed and safety of
[immutability](https://benmccormick.org/2016/06/04/what-are-mutable-and-immutable-data-structures-2).

## Core concepts

Here are the concepts you should understand before trying Vana.

### 1. Immutability is required

For simplicity and safety, Vana enforces deep immutability. Any objects given to
Vana are returned with an immutable type. To avoid compiler errors, be sure to
use `ReadonlyArray<T>` instead of `Array<T>` in your function signatures.

### 2. Observability is transparent

Observable objects can be passed to any existing code without issue, as long as
they don't try to mutate the object. An observable object can be cloned by
passing it to the
[`o`](https://github.com/alloc/vana/blob/c6da35c21bf5c4139e18b79665c2a38d530592f8/src/index.ts#L1)
function.

Every observable object has an `Observable` instance as its
[`$O`](https://github.com/alloc/vana/blob/c6da35c21bf5c4139e18b79665c2a38d530592f8/src/symbols.ts#L1-L2)
property. `Observable` instances only remember the latest revision.

### 3. Observable copies are "revisions"

Observable objects are "revised" by the [`revise`][revise] and [`produce`][produce] functions.
The "revisions" are observable and immutable.

[revise]: https://github.com/alloc/vana/blob/c6da35c21bf5c4139e18b79665c2a38d530592f8/src/funcs/revise.ts#L38-L47
[produce]: https://github.com/alloc/vana/blob/c6da35c21bf5c4139e18b79665c2a38d530592f8/src/index.ts#L15

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
[immer-api]: https://github.com/alloc/vana/blob/3a5bce2b16a8d672bfa489648f47968ce80e8a2c/src/index.ts#L13-L15
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
