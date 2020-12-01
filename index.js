const fs=require('fs')
const util=require('util')
const axios = require('axios')
var crypto = require('crypto')
const mime = require('mime-types') // 文件类型
const FormData = require('form-data')

const isNodeEnv=typeof window === 'undefined'

const readFile = transformFileLoad()
/**
 * ShowapiSDK构造方法
 * @constructor
 * @param {string} url 接口调用地址
 * @param {int} appId 应用id
 * @param {string} sign 应用sign
 * @param {int} timeout 超时毫秒,默认为30秒
 */
function ShowapiSDK(url, appId, sign, timeout = 30000) {
  this.url = url
  this.appId = appId
  this.sign = sign
  this.timeout = timeout
  this.textParas = {}
  this.fileParas = {}
  this.base64Paras = {}
}

ShowapiSDK.prototype = {
  /**
   * 使用本地时间取到时间戳
   */
  getTimpstamp(){
    return createTimestamp()
  },
  /**
   * 设置超时，针对ShowapiSDK对象生命周期有效
   * @param {int} timeout 超时毫秒
   * @returns this
   */
  setTimeout(timeout = 30000) {
    this.timeout = timeout
    return this
  },
  /**
   * 添加一个普通参数，每次post或者get后已添加参数会清空
   * @param {String} name
   * @param {String} value
   * @returns this
   */
  addTextPara(name, value) {
    this.textParas[name] = value
    return this
  },
  /**
   * 添加一个文件参数，每次post后已添加参数会清空
   * @param {String} name
   * @param {String} filePath 文件绝对路径
   * @returns this
   */
  addFilePara(name, filePath) {
    this.fileParas[name] = filePath
    return this
  },
  /**
   * 添加一个base64参数，每次post或者get后已添加参数会清空
   * @param {String} name
   * @param {String} filePath 需要转为base64字符串的文件路径
   * @returns this
   */
  addBase64Para(name, filePath) {
    this.base64Paras[name] = filePath
    return this
  },

  /**
   * 以post方式发送请求,使用axios包
   * @returns {Promise} axios.post()
   */
  async post() {
    const form= await extractParam(this,true)
    return axios.post(this.url,form,{
      headers:isNodeEnv?{
        ...form.getHeaders(),
        "Content-Length": form.getLengthSync()
    }:{},
      timeout:this.timeout
    })
  },
  /**
   * 以get方式发送请求，使用axios包
   * @returns {Promise} axios.get()
   */
  async get() {
    const form= await extractParam(this)
    return axios.get(this.url,{
      timeout:this.timeout,
      params:form
    })
  }
}

/*****组织请求参数 *****/
async function extractParam( showapiSDK,isPost=false){
  const params={
    showapi_appid:showapiSDK.appId,
    //不使用时间戳避免用户本地时间或时期不对导致问题
    // showapi_timestamp:createTimestamp()
  }
  Object.assign(params,showapiSDK.textParas)
  showapiSDK.textParas={}

  for(const[k,v] of Object.entries(showapiSDK.base64Paras)){
    const f=await readFile(v)
    const data = Buffer.from(f).toString('base64')
    const base64 = 'data:' + mime.lookup(v) + ';base64,' + data
    params[k]=base64
  }

  showapiSDK.base64Paras={}

  const sign=getSignString(params,showapiSDK)
  
  params['showapi_sign']=sign

  if(isPost){
    const form=new FormData()
    for(const[k,v] of Object.entries(params)){
      form.append(k,v)
    }
    for(const[k,v] of Object.entries(showapiSDK.fileParas)){
      const f=await readFile(v)
      form.append(k,f,'uploadFile')
    }
    showapiSDK.fileParas={}
    return form
  }else{
    return params
  }
  
}

/**
 * 参考https://www.showapi.com/book/view/3105/40
 */
function getSignString(outParams,showapiSDK) {
  const params = { ...outParams }

  for (const [k, v] of Object.entries(params)) {
    // 去除空值的参数
    if (v === undefined || v === '') {
      delete params[k]
    }
  }

  const sort = getSortString(showapiSDK.sign, params)
  // console.log('sortString', sort)
  return crypto.createHash('md5').update(sort).digest('hex')
}





/**
 * 生成签名的时间戳
 * @return {String}
 */
function createTimestamp() {
  const date = new Date()
  const yyyy = String(date.getFullYear())
  const MM = String(date.getMonth() + 1).padStart(2, '0') // number
  const DD = String(date.getDate()).padStart(2, '0')
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return yyyy + MM + DD + HH + mm + ss
}

/**
 * @param {obj} 除secret外的参数对象
 */
function getSortString(secret, obj) {
  return (
    Object.keys(obj)
      .sort()
      .reduce(function (result, curr) {
        if (!obj[curr].showapiMarkup) {
          result += `${curr}${obj[curr]}`
        }
        return result
      }, '') + secret
  )
}

function   transformFileLoad(){
  
  if(isNodeEnv){
    const read=util.promisify(fs.readFile);
    return  function(fileOrPath){
      if(typeof fileOrPath == 'string'){
        
        return  read(fileOrPath)
      }else{
        return fileOrPath
      }
    }
  }else{
    return async function(fileOrPath){
      if(typeof fileOrPath == 'string'){
        throw new Error(`"${fileOrPath}"不是文件，浏览器端只能传入文件而非文件路径！`)
      }else{
        return fileOrPath
      }
    }
  }
}

module.exports =ShowapiSDK
