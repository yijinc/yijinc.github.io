---
authors: fish
date: 2019-05-09
tags: [javascript]
---


```javascript
var str = 'Hello world!';    // var str = new String('Hello world!')
str.substr(2, 4);
str.indexOf('world');
```

我们经常可以用到的字符串函数 `substr`、`replace`、`indexOf`等，是因为 String 对象上的 prototype 预先定义了这些方法。`str` 为 `String` 的一个实例。 

JavaScript标准库中常用的内置对象上 prototype 的方法还有：
`Array​.prototype​.push`、 `Array​.prototype​.push`  
`Date​.prototype​.get​Date` 、 `Date​.prototype​.get​Year`
`Function​.prototype​.toString` 、 `Function​.prototype​.call`
`...`


我们使用构造函数创建一个对象：

```javascript
function User() {
}
var user = new User();
user.name = '张三';
console.log(user.name) // 张三
```
在这个例子中，`User` 是一个构造函数，我们使用 `new` 创建了一个实例对象 user

### prototype
---
JavaScript 不包含传统的类继承模型，而是使用 prototype 原型模型。
每个函数都有一个 prototype 属性，换句话说， *prototype 是函数才会有的属性*
```javascript
function User() {
}
User.prototype.name = '张三';
var user1 = new User();
var user2 = new User();
console.log(user1.name) // 张三
console.log(user2.name) // 张三
```
函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的 **实例** 的原型。也就是说这个例子中 User 的属性 prototype 对象是 user1 和 user2 的原型。

既然函数的 prototype 属性指向了一个对象，我们可以重写原型对象
```javascript
function User() {}
User.prototype = {
    name: '张三',
    greeting: function() {
        console.log('hello!')
    }
};
var user = new User();
console.log(user.name);   // 张三
user.greeting();  // hello!
```
这样，我们就可以 new User 对象以后，就可以调用  greeting 方法了。

然而将原子类型赋给 prototype 的操作将会被忽略
```javascript
function User() {}
User.prototype = 1 // 无效
```

我们还可以在赋值原型 prototype 的时候使用 function 立即执行的表达式来赋值：
```javascript
function User() {}
User.prototype = function() {
    name = '张三',
	greeting = function() {
        console.log('hello!', this.name)
    }
    return {
	    name: name,
	    greeting: greeting
    }
}();
(new User()).greeting();
```
它的好处就是可以封装私有的 function，通过 return 的形式暴露出简单的使用名称，以达到public/private的效果。

上述使用原型的时候，都是直接赋值原型对象，这样会覆盖之前已定义好的原型，导致之前原型上的方法或属性丢失，所以通常分开设置/覆盖 一个已知函数的 prototype 
```javascript
User.prototype.update = function() {} 
```

###   \__proto__
---

所有 JavaScript 对象（null除外）都有的一个 `__proto__` 属性，这个属性指向该对象的原型
```javascript
function User() {
}
var user1 = new User();
var user2 = new User();
console.log(user1.__proto__ === User.prototype); // true
console.log(user1.__proto__ === user2.__proto__); // true
```
不管你创建多少个 User 对象实例，他们的原型指向的都是同一个 User.prototype

注： \__proto__  并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，不建议在生产中使用该属性，我们可以使用ES5的方法 Object.getPrototypeOf 方法来获取实例对象的原型。
```javascript
Object.getPrototypeOf(user) === User.prototype
```


当查找一个对象的属性时，JavaScript 会向上遍历原型链，直到找到给定名称的属性为止。

到查找到达原型链的顶部 - 也就是 Object.prototype - 但是仍然没有找到指定的属性，就会返回 undefined。

```javascript
function User() {
    this.name = '张三'
}

User.prototype.name = '李四';

Object.prototype.age = 20

var user = new User();
console.log(user.name);  // 张三
console.log(user.age);  // 20

delete user.name
console.log(user.name);  // 李四
```
如果一个属性在原型链的上端，则对于查找时间将带来不利影响。特别的，试图获取一个不存在的属性将会遍历整个原型链。

并且，当使用 for in 循环遍历对象的属性时，原型链上的所有属性都将被访问。

所以在使用 for in loop 遍历对象时，推荐总是使用 hasOwnProperty 方法， 这将会避免原型对象扩展带来的干扰。
```javascript
for(var i in obj) {
    if (obj.hasOwnProperty(i)) {
        console.log(i);
    }
}
```


### 构造函数 
---

通过 new 关键字方式调用的函数都被认为是构造函数

```javascript
function User() { }
var user = new User();
// user.constructor === user.__proto__.constructor 
console.log(user.constructor === User ); // true
console.log(User.prototype.constructor === User); // true
```

原型 constructor 属性指向构造函数，在构造函数内部，this 指向新创建的对象 Object

如果被调用的函数没有显式的 return 表达式，则隐式的会返回 this 对象 - 也就是新创建的对象。

显式的 return 表达式将会影响返回结果，但总是会返回的是一个对象。

```javascript
function Bar() {
    return 2;
}
var bar = new Bar();  // 返回新创建的对象，而不是数字的字面量 2
console.log(bar.constructor === Bar);  // true
```


```javascript
function Foo() {
    this.a = 1;
    
    return {
        b: 2
    };
}

Foo.prototype.c = 3;

var foo = new Foo(); // 返回的对象 {b: 2}
console.log(foo.constructor === Foo);  // false
console.log(foo.a);  // undefined
console.log(foo.b);  // 2
console.log(foo.c);  // undefined
```

这里得到的 foo 是函数**返回的对象**，而不是通过new关键字*新创建的对象*。new Foo()  并不会改变**返回的对象** foo 的原型， 也就是**返回的对象** foo 的原型不会指向 Foo.prototype 。 因为构造函数的原型会被指向到*新创建的对象*，而这里的 Foo 没有把这个*新创建的对象*返回，而是返回了一个包含 b 属性的自定义对象。

如果 new 被遗漏了，则函数不会返回新创建的对象。

```javascript
function Foo() {
    this.abc = 1; // 获取设置全局参数 this===window
}
Foo(); // undefined
```

为了不使用 new 关键字，经常会使用工厂模式创建一个对象。

```javascript
function Foo() {
    var obj = {};
    obj.value = 'blub';

    var private = 2;
    obj.setValue = function(value) {
        this.value = value;
    }

    obj.getPrivate = function() {
        return private;
    }
    return obj;
}
```
上面的方式看起来出错，并且可以使用闭包来达到封装私有变量， 但是随之而来的是一些不好的地方。

- 为了实现继承，工厂方法需要从另外一个对象拷贝所有属性
- 新创建的实例不能共享原型对象上的方法/属性，会占用更多的内存


### 继承
---

下面通过 call 实现继承，并将父级 prototype 给子 prototype
```javascript
function Parent() {
	this.value = 1
}
Parent.prototype.method = function() {
	console.log('value: ' + this.value)
}

function Child() {
	// this -> new Child()
	Parent.call(this);  // 调用Parent构造函数
}

var c1 = new Child();
console.log(c1.value);  // 1

c1.method(); // 报错：Uncaught TypeError: c1.method is not a function

Child.prototype = Parent.prototype;  //继承父方法
var c2 = new Child();

c2.method();  // 'value: 1'

```

但是这样继承存在一个问题，接上面代码继续

```javascript
Child.prototype.fn = function() {
    console.log('abc')
}

var p = new Parent();
p.fn();  // 'abc'
```
因为 Parent.prototype === Child.prototype，原型是同一个引用，可以直接将子类prototype 与 父类分离

```javascript
for(var i in Parent.prototype) {
	Child.prototype[i] = Parent.prototype[i]
}
```

