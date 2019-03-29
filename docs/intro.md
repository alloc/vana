# Introduction

Enjoy the power of reactive subscriptions without losing the speed and safety of
immutability.

## Core concepts

Here are the concepts you should understand before trying Vana.

### 1. Observability is transparent

The only way to know if an object is observable is by using the `isObservable`
function. This means observable objects can be used with most JS libraries,
since they won't need to handle Vana-specific classes. This makes Vana great at
blending into its surroundings.

### 2. Observability is deep

When an object is made observable with Vana, any nested objects will also be
made observable (when possible). You can freeze a nested object to prevent it
from being observed. Deep observability is crucial for keeping track of which
immutable copy is the most recent. It also means less work for use cases that
require deep observability.

### 3. Observability is temporary

Observable objects can only be revised once. After that, you must revise the
newest copy (which has the latest mutations). Otherwise, an error will be
thrown. This ensures you're never accidentally using stale data.

### 4. Immutability is required

For simplicity and safety, Vana enforces deep immutability. Any objects given to
Vana are returned with an immutable type. To avoid compiler errors, be sure to
use `ReadonlyArray<T>` instead of `Array<T>` in your function signatures.

### 5. Tightly integrated with Immer

[Immer] lets users write imperative code that produces a mutated copy of any
immutable object. **Structural sharing** is used to avoid redundant cloning.
For a seamless experience, Vana is tightly integrated with Immer. In fact, the
author of Vana is one of Immer's two maintainers! **Note:** You should never
import from `immer` directly, because Vana uses its own instance of Immer.
Luckily, Vana re-exports everything you'll need.

[immer]: https://github.com/mweststrate/immer

&nbsp;

## Rules of thumb

Here are a few rules that steer you clear of avoidable issues.

### 1. Prefer object _identifiers_ over object _references_

Once an object is referenced in multiple places, your state tree becomes a
state graph. Although Vana may work with state graphs in simple cases, it makes
no guarantees. Since Vana is not tested with state graphs, we recommend avoiding
them by using unique identifiers instead.

### 2. Stick to plain objects and arrays (for now)

Eventually, Vana will support "immutable classes" that can opt-in to being
treated like plain objects. For now, only plain objects and arrays can be
observed. All other objects are treated like primitives in that they cannot be
observed.

&nbsp;

_More rules may be added in the future._
