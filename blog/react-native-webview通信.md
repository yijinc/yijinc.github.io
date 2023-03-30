---
authors: fish
date: 2019-09-26
tags: [ReactNative, Webview]
---


react-native 通过 WebView 组件可以非常简单的实现通信，这里通过从RN中分离出来的[react-native-webview](https://github.com/react-native-community/react-native-webview) 为例，介绍 WebView 的通信机制。


react-native-webview 与 web 通信，提供以下3个方法
- React Native -> Web:  `injectedJavaScript` 属性
- React Native -> Web:  `injectJavaScript` 方法（this.refs.webviewr.injectJavaScript(...)）
- Web -> React Native:  `onMessage` 属性回调，  web调用`window.ReactNativeWebView.postMessage`

```javascript
import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  render() {
	const injectedJavaScriptCode = `document.body.style.backgroundColor = 'red';`
	
	setTimeout(() => {
	  // rn 注入调用（执行） web的 window.alert 方法
      this.webref.injectJavaScript(`window.alert('hello')`);
    }, 3000);
    
    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={r => (this.webref = r)}
          source={{
            uri: 'https://xxx.com/index.html'
          }}
          // 向web注入js代码
          injectedJavaScript={injectedJavaScriptCode} 
          // 监听web发送过来的消息
          onMessage={event => {
            alert(event.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}
```

可以看出，WebView 与 Web 通信非常简单，但却是单向的：WebView 可以触发 Web的方法（一般为全局window下的），Web 也可以发送消息/数据到 WebView。

如果 Web 想要获取 app 内的的数据（甚至携带一些参数），得到一个返回/响应，WebView 如何将这个返回值响应给 Web？ 

```javascript
// web code
getAppVersion('ios', (version) => alert(version))
```

我们可能会在打开webview时 注入一些初始化的js代码和数据，但这肯定无法满足 web 在使用期间需要获取app数据。

```javascript
// web code
window.initDataFromApp = (data) => { /**do something **/}

// RN code
<WebView
	injectedJavaScript={`initDataFromApp && initDataFromApp(${JSON.stringify(data)});`}
    />
```

---
要实现 RN -> web  或  web -> RN 有响应的通信，通过webview提供的三个基本方法，我们可以自己封装一套通信回调的机制。


直接上代码

```javascript
/***
 * postJsCode.js 
 * 预注入webview javascript code
 * web端使用：
 * window.APP.invokeClientMethod('getList', { page: 1 , size: 10}, callback);
 * * */
function clientMethod() {
    var APP = {
        __GLOBAL_FUNC_INDEX__: 0,
        invokeClientMethod: function (type, params, callback) {
            var callbackName;
            if (typeof callback === 'function') {
                callbackName = '__CALLBACK__' + (APP.__GLOBAL_FUNC_INDEX__++);
                APP[callbackName] = callback;
            }
            window.ReactNativeWebView.postMessage(JSON.stringify({type, params, callback: callbackName }));
        },
        invokeWebMethod: function (callback, args) {
            if (typeof callback==='string') {
                var func = APP[callback];
                if (typeof func === 'function') {
                    setTimeout(function () {
                        func.call(this, args);
                    }, 0);
                }
            }
        },
    };
    window.APP = APP;
    window.webviewCallback = function(data) {
        window.APP['invokeWebMethod'](data.callback, data.args);
    };
}

```


WebViewScreen.js

```javascript
import React, { Component } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import clientMethod from './postJsCode';
const patchPostMessageJsCode = `(${String(clientMethod)})(); true;`;

export default class WebViewScreen extends Component {  
    webref = null;
    /***
     * 接收web发送过来的消息，调用rn中提供的方法
     */
    onMessage = event => {
        var data = JSON.parse(event.nativeEvent.data);
        if (!data) {
            return;
        }
        const { type, params, callback } = data;
        switch (type) {
        case 'getUser':
            const json = {
                callback,
                args: {
                    name: '王者荣耀',
                    age: 29,
                }
            };
            this.webref.injectJavaScript(`webviewCallback(${JSON.stringify(json)})`);
            break;

        // 导航到 app 指定 screen/page
        case 'navigate':
            const { screen } = params;
            this.props.navigation.navigate(screen);
            break;
        }

    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <WebView
                    onMessage={this.onMessage}
                    ref={r => (this.webref = r)}
                    injectedJavaScript={patchPostMessageJsCode}
                    source={{ uri: 'https://xxx.com/index.html' }}
                />
            </SafeAreaView>
        );
    }
}
```
这里主要预定义了type, params, callback 参数，在web中使用： `window.APP.invokeClientMethod(type, params, callback)`,  type 在 RN的 onMessage 处理对应 case。

其原理步骤是： 
- web 调用 invokeClientMethod方法，将回调 callback 放入 APP对象的属性上：`window.APP['__GLOBAL_FUNC_INDEX__0'] = callback`
- 然后web再真正发起 postMessage（JSON.string）到RN
- RN 的 onMessage 接收到 event（JSON.parse）
- RN 处理完后，通过 `this.webref.injectJavaScript` 触发调用 放在全局的 `window.APP['__GLOBAL_FUNC_INDEX__0']`回调

由于Javascript是单线程执行的，`__GLOBAL_FUNC_INDEX__` 属性可以确保唯一，所以即使在并发调用时时，也可以正常回调。


注意，injectedJavaScript 属性 注入时机在ios和android表现不一样，在ios上 注入代码页面打开马上可以得到，然而在android 上是延迟被注入的，（像是在页面加载完后在尾部引入Script脚本，没有深入研究了），所以在web开发中 组件 mounted 时 务必要等待 injectedJavaScript 注入完成才做响应处理。


---

早期RN版本，是web直接调用window.postMessage通信的， 设置onMessage的同时会在webview中注入一个postMessage的全局函数并覆盖可能已经存在的同名实现。可能需要对web原生postMessage做个兼容。然后我们可以在web中 监听 onMessage 触发回调（或者在组件挂载期间监听message）

```javascript
function patchPostMessageFunction(){
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = (message, targetOrigin, transfer) => {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    window.postMessage = patchedPostMessage;
    if(window.APP) {
        window.document.addEventListener('message', function (e) {
            const callbackObj = JSON.parse(e.data);
            window.APP['invokeWebMethod'](callbackObj.callback, callbackObj.args);
        });   
    }
}
```