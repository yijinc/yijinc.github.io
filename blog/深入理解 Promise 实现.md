---
authors: fish
date: 2022-06-14
tags: [Promise]
---


网上有很多 Promise 实现方式，看了都不是特别理解。
这里以一种更简单的形式一步一步去理解/实现它。这里仅涉及 Promise 构造函数和 then 方法的实现

首先构造一个最基本的 Promise 类

```javascript
// version_1
class Promise {
    callbacks = [];
    constructor(executor) {
        executor(this._resolve.bind(this));
    }
    then(onFulfilled) {
        this.callbacks.push(onFulfilled);
    }
    _resolve(value) {
        this.callbacks.forEach(callback => callback(value));
    }
}

// test
new Promise(resolve => {
    setTimeout(() => {
        console.log('await 2s');
        resolve('ok');
    }, 2000);
}).then((res) => {
    console.log('then', res);
})
```

1. Promise 构造函数会立即执行用户传入的函数 executor，并且把 _resolve 方法作为 executor 的参数，传给用户处理
2. 调用 then 方法（同步），将 onFulfilled 放入callbacks队列，其实也就是注册回调函数，类似于观察者模式。
3. executor 模拟了异步，这里是过2s后执行 resolve，对应触发 _resolve 内的 callbacks


### `.then(onFulfilled)` 为何需要用一个数组存放？

then 方法可以调用多次，注册的多个onFulfilled，并且这些 onFulfilled callbacks 会在异步操作完成（执行resolve）后根据添加的顺序依次执行

```javascript
// then 注册多个 onFulfilled 回调
const p = new Promise(resolve => {
    setTimeout(() => {
        console.log('await 2s');
        resolve('ok');
    }, 2000);
});

p.then(res => console.log('then1', res));
p.then(res => console.log('then2', res));
p.then(res => console.log('then3', res));
```


### 异步执行处理 setTimeout vs status

上面 Promise 的实现存在一个问题：如果传入的 executor 不是一个异步函数，resolve直接同步执行，这时 callbacks 还是空数组， 导致后面 then 方法注册的 onFulfilled 回调就不会执行（resolve 比 then 注册先执行）

```javascript
// 同步执行 resolve
new Promise(resolve => {
    console.log('同步执行');
    resolve('同步执行');
}).then(res => {
    console.log('then', res);
})
```

我们知道 then 中的回调总是通过异步执行的，我们可以在 resolve 中加入 setTimeout，将 callbacks 的执行时机放置到JS消息队列，这样 then方法的 onFulfilled 会先完成注册，再执行消息队列的 resolve

```javascript
// version_2
class Promise {
    callbacks = [];
    constructor(executor) {
        executor(this._resolve.bind(this));
    }
    then(onFulfilled) {
        this.callbacks.push(onFulfilled);
    }
    _resolve(value) {
        setTimeout(() => {
	    this.callbacks.forEach(callback => callback(value));
        })
    }
}
```

但是这样仍然有问题，如果我们延迟给 then 注册回调，这些回调也都无法执行。因为
还是 resolve 先执行完了，之后注册的回调就无法执行了。

```javascript
const p = new Promise(resolve => {
    console.log('同步执行');
    resolve('同步执行');
})

setTimeout(() => {
    p.then(res => {
        console.log('then', res); // never execute
    })
});
```

可以看出 setTimeout 是无法保证 then 注册的 onFulfilled 正确执行的，所以这里必须加入状态机制（pending、fulfilled、rejected），且状态只能由 pending 转换为解决或拒绝。


```javascript
// version_3：增加状态机制
class Promise {
    callbacks = [];
    status = 'pending';
    value = undefined;
    constructor(executor) {
        executor(this._resolve.bind(this));
    }
    then(onFulfilled) {
	if (this.status === 'pending') {
		this.callbacks.push(onFulfilled);
	} else {
		onFulfilled(this.value);
	}
    }
    _resolve(value) {
	this.status = 'fulfilled';
	this.value = value;
        this.callbacks.forEach(callback => callback(value));
    }
}
```

当增加了状态后，setTimeout 就可以去掉了，状态机制让注册的回调总是能正确工作。
- 当 resolve **同步**执行时，立即执行 resolve，将 status 设置为 fulfilled ，并把 value 的值存起来， 在此之后调用 then 添加的新回调，都会立即执行
- 当 resolve **异步**执行时，pending 状态执行 then 会添加回调函数， 等到 resolve 执行时，回调函数会全部被执行。

### then的链式调用

链式调用我们可能很直接想到 then 方法中返回 this，这样 Promise 实例就可以多次调用 then 方法，但因为是同一个实例，调用再多次 then 也只能返回相同的一个结果。而我们希望的链式调用应该是这样的：

```javascript
new Promise(resolve => {
	resolve(1)
}).then(res => res + 2)	// 1 + 2 = 3
	.then(res => res + 3) // 3 + 3 = 6
	.then(res => console.log(res)); // expected 6
```
每个 then 注册的 onFulfilled 都返回不同结果，并把结果传给下一个 onFulfilled 的参数，所以 then 需要返回一个新的 Promise 实例

```javascript
// version_4：then 的链式调用
class Promise {
  callbacks = [];
  status = 'pending';
  value = undefined;
  constructor(executor) {
    executor(this._resolve.bind(this));
  }
  then(onFulfilled) {
    return new Promise(resolveNext => {
      const fulfilled = (value) => {
        const results = onFulfilled(value); // 执行 onFulfilled
        resolveNext(results); // 再执行 resolveNext
      }
      if (this.status === 'pending') {
        this.callbacks.push(fulfilled);
      } else {
        fulfilled(this.value);
      }  
    })
  }
  _resolve(value) {
    this.status = 'fulfilled';
    this.value = value;
    this.callbacks.forEach(callback => callback(value));
  }
}
```

这样一个 Promise 就基本实现了，我们可以看到：

- then 方法中，创建并返回了新的 Promise 实例，这是串行 Promise 的基础
- 我们把 then 方法传入的 形参 onFulfilled 以及创建新 Promise 实例时传入的 resolveNext 合成一个 新函数 fulfilled，这是衔接当前 Promise 和后邻 Promise 的关键所在


### 处理返回 Promise 类型的回调

这里还有一种特殊的情况：
- resolve 方法传入的参数为一个 Promise 对象时
- onFulfilled 方法返回一个 Promise 对象时

这时我们只需用 `res instanceof Promise` 判断处理下

```javascript
// version_5：Promise 参数处理
class Promise {
  callbacks = [];
  status = 'pending';
  value = undefined;

  constructor(executor) {
    executor(this._resolve.bind(this));
  }

  then(onFulfilled) {
    return new Promise(resolveNext => {
      const fulfilled = (value) => {
        const results = onFulfilled(value);
        if (results instanceof Promise) {
          // 如果当前回调函数返回Promise对象，必须等待其状态改变后在执行下一个回调
          results.then(resolveNext);
        } else {
          // 否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
          resolveNext(results);
        }
      }
      if (this.status === 'pending') {
        this.callbacks.push(fulfilled);
      } else {
        fulfilled(this.value);
      }  
    })
  }

  _resolve(value) {
    this.status = 'fulfilled';
    /**
     * 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
     * 当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态 
    */
    if (value instanceof Promise) {
      value.then(nextValue => {
        this.value = nextValue;
        this.callbacks.forEach(callback => callback(value));
      })
    } else {
      this.value = value;
      this.callbacks.forEach(callback => callback(value));
    }
  }
}
```

### 拓展练习（面试题）

尝试实现下面函数 `LazyMan` 的功能

```javascript
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```
参考答案[from Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/98)


