const fs = require('fs')
const ShowapiRequest = require('.')

if(typeof window !== 'undefined'){//提供给页面测试用
  window.ShowapiRequest=ShowapiRequest
}

const sdk = new ShowapiRequest(
  'https://route.showapi.com/887-2',
  // 'https://route.showapi.com/887-1',
  // 'https://route.showapi.com/887-4',
  '',//替换为真实的appId
  ''//替换为真实的密钥
)

sdk
  .addFilePara('img', './static/xxx.png')
  // .addTextPara('content','https://baidu.com')
  // .addBase64Para('imgData','./static/xxx.png')
  .post()
  // .get()
  .then((res) => {
    console.info("#####result:",res.data)
    // console.info("#######axios all response:",res)
  })
  .catch((error) => {
    console.error(error)
  })





