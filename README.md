# miaow-inline-parse

> Miaow的资源嵌入工具,可以将指定资源以Data-URI的格式或是内容直接嵌入进来

## 效果示例

```css
.foo {
  background: url(./foo.png#inline);
}

/* 处理后 */
.foo {
  background: url(data-uri);
}
```

### 参数说明

#### keyword
Type:`String` Default:`inline`

用于匹配哪些链接需要做嵌入操作

#### regexp
Type:`RegExp` Default:`new RegExp('[\'"\\(](([\\w\\_\\/\\.\\-]*)\\#' + keyword + ')[\'\"\\)]', 'gi')`

自定义正则表达式

需要有两个匹配组, 第一个是替换的整体内容, 第二个是资源路径

#### type
Type:`String` Default:`data-uri`

嵌入的方式

支持Data-URI和内容嵌入, 如果想嵌入内容, 请设置为`content`
