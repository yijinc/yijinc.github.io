---
authors: fish
date: 2019-09-21
tags: [git]
title: 代码规范
---

## JavaScript


- 使用 2 个空格缩进。eslint: [indent](https://eslint.org/docs/rules/indent)
- 使用分号。eslint: [semi](https://eslint.org/docs/rules/semi)
- 始终使用大括号包裹代码块。eslint: [curly](https://eslint.org/docs/rules/curly) [nonblock-statement-body-position](https://eslint.org/docs/rules/nonblock-statement-body-position)
- 空格风格。eslint: [space-before-blocks](https://eslint.org/docs/rules/space-before-blocks) [keyword-spacing](https://eslint.org/docs/rules/keyword-spacing) [space-in-parens](https://eslint.org/docs/rules/space-in-parens) [array-bracket-spacing](https://eslint.org/docs/rules/array-bracket-spacing) [object-curly-spacing](https://eslint.org/docs/rules/object-curly-spacing) [space-infix-ops](https://eslint.org/docs/rules/space-infix-ops) [key-spacing](https://eslint.org/docs/rules/key-spacing)
- 对于逗号分隔的多行结构，始终加上最后一个逗号。eslint: [comma-dangle](https://eslint.org/docs/rules/comma-dangle)

- ...

对于js/es ，现在基本都是通过 [ESlint](https://github.com/eslint/eslint) 做代码风格统一。
我们采用国内使用比较多的 [eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy) 配置规范，它适用于 React / Vue / Typescript 项目，样式规则交给 [Prettier](https://prettier.io/)  管理

> ⚠️ 需在 IDE 中安装 ESLint 扩展才会有提示



## HTML

### DOCTYPE 设置

文档类型统一使用html5的doctype：
```html
<!DOCTYPE html>
```

### 页面编码

使用 UTF-8 字符编码

```html
<meta charset="UTF-8">
```

### 标题

页面需要指定 title 标签，有且仅有 1 个

```html
<title>标题 - 子分类 - 大分类</title>
```

### 元数据

关键字、描述

```html
<meta name="keywords" content="Keywords为产品名、专题名、专题相关名词，之间逗号隔开" />
<meta name="description" content="不超过150个字符，描述内容要和页面内容相关" />
```


页面提供给移动设备使用时，需要设置 [viewport](https://drafts.csswg.org/css-device-adapt/#viewport-meta)。
设置 viewport-fit 设置为“cover”来兼容 iPhone X 的刘海屏，[了解更多](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) 。
 
```html
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
```

### 资源加载

- 引入 CSS 和 JavaScript 时无需指定 type。
  根据 HTML5 规范，引入 CSS 和 JavaScript 时通常不需要指明 type，因为 [text/css](https://html.spec.whatwg.org/multipage/obsolete.html#attr-style-type) 和 [text/javascript](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-type) 分别是他们的默认值。

- 在 head 标签内引入 CSS，在 body 结束标签前引入 JS。
在 `<body></body>` 中指定外部样式表和嵌入式样式块可能会导致页面的重排和重绘，对页面的渲染造成影响。因此，一般情况下，CSS 应在 `<head></head>` 标签里引入，[了解更多](https://developer.yahoo.com/performance/rules.html#css_top)。

  > 在 HTTP2（Chrome 浏览器 69 版本之后，Firefox 和 Edge）中可以在 body 中使用 link 标签引入样式文件，但不推荐在 body 中使用 `<style>` 标签的内联样式。**`<link rel="stylesheet">` 将会阻止后续内容的渲染，而不是整个页面**。
  
  除了基础库等必须要在 DOM 加载之前运行的 JavaScript 脚本，其他都在靠近 `body` 结束标签前引入，以防止出现页面渲染的阻塞，[了解更多](https://developer.yahoo.com/performance/rules.html#js_bottom)。

```html
  <!DOCTYPE html>
  <html>
    <head>
	  <link rel="stylesheet" href="//g.alicdn.com/lib/style/index-min.css" />
      <style>
        .mod-example {
          padding-left: 15px;
        }
      </style>
    </head>
    <body>
      ...
      <script src="path/to/vender.js"></script>
      <script src="path/to/my/script.js"></script>
    </body>
  </html>
```

### 标签

- 标签必须合法且闭合、嵌套正确，标签名小写
- 不要省略自闭合标签结尾处的斜线，且斜线前需留有一个空格。
虽然 [HTML5 规范](https://dev.w3.org/html5/spec-author-view/syntax.html#syntax-start-tag) 中指出结尾的斜线是可选的，但保留它们可以明确表达该标签已闭合的语义，更易于维护和理解。

- 给 `<img>` 标签加上 alt 属性。
- 给 `<a>` 标签加上 title 属性。
- 属性值使用双引号，不要使用单引号。
  

根据以上规约，建议的 HTML 脚手架模板如下：

移动端模版：
```html
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta charset="UTF-8">
		<title>标题 - 子分类 - 大分类</title>
		<meta name="keywords" content="Keywords为产品名、专题名、专题相关名词，之间逗号隔开" />
		<meta name="description" content="不超过150个字符，描述内容要和页面内容相关" />
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
		<!-- 为了防止页面数字被识别为电话号码，可根据实际需要添加： -->
		<meta name="format-detection" content="telephone=no"> 
		<!-- 让添加到主屏幕的网页再次打开时全屏展示，可添加：   -->
		<meta content="yes" name="mobile-web-app-capable">
		<meta content="yes" name="apple-mobile-web-app-capable">
		<meta name="robots" content="all">
		<meta name="author" content="公司-部门或产品" />
		<meta name="Copyright" content="公司" />
		<link rel="shortcut icon" href="favicon.ico">
	</head>
</html>
```

PC端模版：

```html
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta charset="UTF-8">
		<title>标题 - 子分类 - 大分类</title>
		<meta name="keywords" content="Keywords为产品名、专题名、专题相关名词，之间逗号隔开" />
		<meta name="description" content="不超过150个字符，描述内容要和页面内容相关" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="robots" content="all">
		<meta name="author" content="公司-部门或产品" />
		<meta name="Copyright" content="公司" />
		<link rel="shortcut icon" href="favicon.ico">
	</head>
</html>
```

## CSS

![示例代码标注图](https://img.alicdn.com/tfs/TB1TOLiTpP7gK0jSZFjXXc5aXXa-753-427.svg)

- 所有声明都应该以分号结尾
- 使用 2 个空格缩进，不要使用 4 个空格或 tab 缩进
- 使用一个空格：
	- 选择器和 `{` 之间保留一个空格
	- `:` 和属性值之间保留一个空格
	- `>`、`+`、`~` 、`||` 等组合器前后各保留一个空格
	- 在使用 , 分隔的属性值中，`,` 之后保留一个空格
	- 注释内容和注释符之间留有一个空格
- 使用多个选择器时，每个选择器应该单独成行
- 尽量不要使用 !important 重写样式
- 长度值为 0 时，省略掉长度单位
- 嵌套选择器的深度不要超过 3 层，否则可能带来一些副作用


 
## 参考

- [ES6编程风格 - 阮一峰](https://es6.ruanyifeng.com/#docs/style)
- [前端编码规范 - 百度](https://github.com/ecomfe/spec)
- [代码规范 - 阿里](https://github.com/alibaba/f2e-spec)
- [页面前端规范 - 腾讯qq](https://tgideas.qq.com/doc/frontend/spec/common/)
- [代码规范 - AlloyTeam](http://alloyteam.github.io/CodeGuide/)
- [Bootstrap 编码规范](https://codeguide.bootcss.com/)
