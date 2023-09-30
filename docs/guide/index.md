---
title: 快速上手
order: 1
---

# 使用指南

## 配置 Alias

### 开发: 配置 tsconfig.json

为了在

在根目录下修改 `tsconfig.json` 中的 `path` 参数项:

```json
{
  "baseUrl": ".",
  "paths": {
    "<module-name>": ["./packages/<path-name>/src"]
    "@ims-view/modules-bar": ["./packages/bar/src"]
  }
}
```

### 测试: 配置 Jest

为了在测试中能够正常识别其他引用

在根目录下修改 `jest.config.base.ts` 中的 `moduleNameMapper` 参数:

```typescript
const config = {
  // ...
  moduleNameMapper: {
    '@ims-view/modules-bar': '<rootDir>/packages/bar/src',
    "<module-name>": "'<rootDir>/packages/<path-name>/src"]
  },
};
```

然后需要在 根目录的 `.babelrc` 文件中配置 `module-resolver` 的 `alias` 配置项

## 配置 father-build

如果模块之间存在依赖关系,那么需要在该模块的在 `father-build` 的配置文件 `.fatherrc.js` 中添加 `pkgs` 配置项

例如模块 `foo` 依赖了 `bar` , 那么就需要在 foo 模块的目录下的 `.fatherrc.js` 中添加 `pkgs` 参数,如下所示:

```js
// packages/foo/.fatherrc.js
module.exports = {
  // ...
  pkgs: [
    // 依赖过
    '@ims-view/modules-bar',
  ],
};
```

<code src='./a.tsx'>xx </code>
