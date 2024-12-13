# Fan Use

### Install

```ssh
// Gitee
npm i git+https://gitee.com/thiszhong/fan-use.git#v0.0.15 axios qs@~6.9.0

// Github
pnpm install git+https://github.com/FanConsole/fan-use.git#v0.0.15 axios qs@~6.9.0
```

### 使用

#### UniApp 项目配置

- jsconfig / tsconfig 中 `compilerOptions.paths` 增加 `"fan-use": ["fan-use/uniapp"]`
- vite.config 中 `resolve.alias` 增加 `'fan-use': 'fan-use/uniapp'`
