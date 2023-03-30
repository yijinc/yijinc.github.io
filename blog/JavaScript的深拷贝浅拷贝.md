---
authors: fish
date: 2019-06-15
tags: [javascript]
---

### JavaScript深拷贝浅拷贝

JavaScript 数据类型分为两种：
* 基础类型：像Number、String、Boolean等
* 引用类型：像Object、Array、Function等

浅拷贝只是复制了对象的引用地址，两个对象指向同一个内存地址，所以修改其中任意的值，另一个值都会随之变化。`Array.prototype.slice/concat` ， `Object.assign` 扩展运算符`...` 都是浅拷贝

```javascript
var obj = { a: 1, b: { foo: 'foo' } };
var newObj = {...obj};  // 或 var newObj = Object.assign({}, obj);
newObj.b.foo = 0;
console.log(obj);   // { a: 1, b: { foo: 0 } };
```

与之对应的就是深拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

`JSON.parse( JSON.stringify(obj) )` 可以简单粗暴的作为深拷贝，但不能拷贝函数

自己实现一个深拷贝

```javascript
var deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
```

一般在开发中会引用第三方工具库，会提供深拷贝方法 如 lodash的_.cloneDeep， jquery的$.extend， immutable的数据转换等