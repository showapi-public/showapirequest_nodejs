仅适用于调用showapi.com的接口!  ES6 await async语法的Promise版本，请求库使用axios [axios 文档地址](https://github.com/axios/axios#axiosrequestconfig)

 
### 安装

#### yarn

```bash
yarn add showapirequest_nodejs
```

#### npm

```bash
npm i showapirequest_nodejs
```

### 使用示例

#### 调用二维码识别接口
```js
const fs = require('fs')
const ShowapiRequest = require('showapirequest_nodejs')

//创建请求对象
const sdk = new ShowapiRequest(
  'https://route.showapi.com/887-2',//接口地址
  'appId',//替换为真实的appId
  'sign'//替换为真实的密钥
)

sdk
  .addFilePara('img', './static/xxx.png')//添加文件参数,
  .post()//post方式发送请求，返回axios.post()的Promise
  .then((res) => {
    console.info("#####result:",res.data)
    console.info("#######axios all response:",res)
  })
  .catch((error) => {
    console.error(error)
  })
```

#### 调用生成二维码接口
```js
const fs = require('fs')
const ShowapiRequest = require('showapirequest_nodejs')

//创建请求对象
const sdk = new ShowapiRequest(
  'https://route.showapi.com/887-1',//接口地址
  'appId',//替换为真实的appId
  'sign'//替换为真实的密钥
)

sdk
  .addTextPara('content','https://baidu.com')//添加普通参数
  .get()//get方式发送请求，返回axios.get()的Promise
  .then((res) => {
    console.info("#####result:",res.data)
    console.info("#######axios all response:",res)
  })
  .catch((error) => {
    console.error(error)
  })
```


#### 调用二维码识别接口，文件转base64传参方式
```js
const fs = require('fs')
const ShowapiRequest = require('showapirequest_nodejs')

//创建请求对象
const sdk = new ShowapiRequest(
  'https://route.showapi.com/887-4',//接口地址
  'appId',//替换为真实的appId
  'sign'//替换为真实的密钥
)

sdk
  .addBase64Para('imgData','./static/xxx.png')//添加base64参数
  .post()//post方式发送请求，返回axios.post()的Promise
  .then((res) => {
    console.info("#####result:",res.data)
    console.info("#######axios all response:",res)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 兼容性
本sdk使用了 ES6 Promises以及es6 async await特性, 请确保你的环境支持它






## Classes

<dl>
<dt><a href="#ShowapiSDK">ShowapiSDK</a></dt>
<dd></dd>
</dl>

## Functions



<a name="ShowapiSDK"></a>

## ShowapiSDK
**Kind**: global class  

* [ShowapiSDK](#ShowapiSDK)
    * [new ShowapiSDK(url, appId, sign, timeout)](#new_ShowapiSDK_new)
    * [.setTimeout(timeout)](#ShowapiSDK+setTimeout)
    * [.addTextPara(name, value)](#ShowapiSDK+addTextPara) ⇒
    * [.addFilePara(name, fileOrPath)](#ShowapiSDK+addFilePara) ⇒
    * [.addBase64Para(name, fileOrPath)](#ShowapiSDK+addBase64Para) ⇒
    * [.post()](#ShowapiSDK+post) ⇒ <code>Promise</code>
    * [.get()](#ShowapiSDK+get) ⇒ <code>Promise</code>

<a name="new_ShowapiSDK_new"></a>

### new ShowapiSDK(url, appId, sign, timeout)
ShowapiSDK构造方法


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | 接口调用地址 |
| appId | <code>int</code> |  | 应用id |
| sign | <code>string</code> |  | 应用sign |
| timeout | <code>int</code> | <code>30000</code> | 超时毫秒,默认为30秒 |

<a name="ShowapiSDK+setTimeout"></a>

### showapiSDK.setTimeout(timeout)
设置超时，针对ShowapiSDK对象生命周期有效

**Kind**: instance method of [<code>ShowapiSDK</code>](#ShowapiSDK)  

| Param | Type | Description |
| --- | --- | --- |
| timeout | <code>int</code> | 超时毫秒 |

<a name="ShowapiSDK+addTextPara"></a>

### showapiSDK.addTextPara(name, value) ⇒
添加一个普通参数，每次post或者get后已添加参数会清空

**Kind**: instance method of [<code>ShowapiSDK</code>](#ShowapiSDK)  
**Returns**: this  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 
| value | <code>String</code> | 

<a name="ShowapiSDK+addFilePara"></a>

### showapiSDK.addFilePara(name, fileOrPath) ⇒
添加一个文件参数，每次post后已添加参数会清空
注意在浏览器端使用时只能使用上传input获取到文件后传入，不能使用文件路径作为参数。浏览器下无法使用fs包

**Kind**: instance method of [<code>ShowapiSDK</code>](#ShowapiSDK)  
**Returns**: this  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> |  |
| fileOrPath | <code>String</code> | 文件绝对路径或者文件对象（浏览器端只能使用文件对象） |

<a name="ShowapiSDK+addBase64Para"></a>

### showapiSDK.addBase64Para(name, filePath) ⇒
添加一个base64参数，每次post或者get后已添加参数会清空
注意在浏览器端使用时只能使用上传input获取到文件后传入，不能使用文件路径作为参数。浏览器下无法使用fs包

**Kind**: instance method of [<code>ShowapiSDK</code>](#ShowapiSDK)  
**Returns**: this  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> |  |
| fileOrPath | <code>String</code> | 需要转为base64字符串的文件路径或者原始文件对象（浏览器端只能使用文件对象）|

<a name="ShowapiSDK+post"></a>

### showapiSDK.post() ⇒ <code>Promise</code>
以post方式发送请求,使用axios包

**Kind**: instance method of [<code>ShowapiSDK</code>](#ShowapiSDK)  
**Returns**: <code>Promise</code> - axios.post()  
<a name="ShowapiSDK+get"></a>

### showapiSDK.get() ⇒ <code>Promise</code>
以get方式发送请求，使用axios包

**Kind**: instance method of [<code>ShowapiSDK</code>](#ShowapiSDK)  
**Returns**: <code>Promise</code> - axios.get()  


