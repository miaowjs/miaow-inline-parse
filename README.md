# miaow-inline-parse

> Miaow的资源嵌入工具,可以将指定资源以Data-URI的格式嵌入进来


```css
.foo {
  background: url(./foo.png?inline);
}

/* 处理后 */
.foo {
  background: url(data-uri);
}
```

## 使用说明

### 安装

```
npm install miaow-inline-parse -save
```

### 在项目的 miaow.config.js 中添加模块的 parse 设置

```javascript
//miaow.config.js
module: {
  parse: [
    {
      test: /\.(js|css)$/,
      plugins: ['miaow-inline-parse']
    }
  ]
}
```

### 选项

* keyword 默认是`inline`, 用于匹配哪些链接需要做嵌入操作
