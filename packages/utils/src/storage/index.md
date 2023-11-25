---
title: storage
order: 2
apiHeader:
  pkg: '@ims-view/utils'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/storage/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/utils/src/storage/index.tsx
---

## storage

```ts
import { storage } from '@ims-view/utils';
const { cookie, localStore, sessionStore } = storage;
```

### cookie

```ts
cookie.getCookie(name?: string, cookieKey: string = 'token');
cookie.setCookie(name: string, value: any, cookieKey: string = 'token');
cookie.removeCookie(name: string, cookieKey: string = 'token');
```

### localStore

```ts
localStore.get('token');
localStore.set('token', '123');
localStore.remove('token');
localStore.removeAll();
```

### sessionStore

```ts
sessionStore.get('token');
sessionStore.set('token', '123');
sessionStore.remove('token');
sessionStore.removeAll();
```
