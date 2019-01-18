# The Basics

Before we can observe any changes, we need to make our objects observable.

```ts
import { o } from 'vana'

let user = o({
  name: 'Alec',
  likes: ['food', 'sleep'],
})
```

The `user` variable now equals the object passed to `o()`, which is now observable!

_TODO: Finish documentation_
