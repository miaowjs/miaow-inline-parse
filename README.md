# miaow-inline-parse

> Miaow的资源嵌入工具,可以将指定资源以Data-URI的格式或是内容直接嵌入进来


```css
.foo {
  background: url(./foo.png#inline);
}

/* 处理后 */
.foo {
  background: url(data-uri);
}
```

## 使用说明

### 安装

```
npm install miaow-inline-parse --save-dev
```

### 在项目的 miaow.config.js 中添加模块的 tasks 设置

```javascript
//miaow.config.js
module: {
  tasks: [
    {
      test: /\.(js|css)$/,
      plugins: ['miaow-inline-parse']
    }
  ]
}
```

### 选项

* keyword 默认是`inline`, 用于匹配哪些链接需要做嵌入操作
* regexp 自定义正则表达式, 需要有两个匹配组, 第一个是替换的整体内容, 第二个是资源路径
* type 默认是`data-uri`, 嵌入的方式, 支持Data-URI和内容嵌入, 如果想嵌入内容, 请设置为`content`
