import SealGo from '../../core/SealGo'
import qiniu from 'qiniu'
import { PluginConfig } from '../../utils/interfaces'

function postOptions (options: any, fileName: string, token: string, imgBase64: string): any {
  const area = selectArea(options.area || 'z0')
  const path = options.path || ''
  const base64FileName = Buffer.from(path + fileName, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
  return {
    method: 'POST',
    url: `http://upload${area}.qiniu.com/putb64/-1/key/${base64FileName}`,
    headers: {
      Authorization: `UpToken ${token}`,
      contentType: 'application/octet-stream'
    },
    body: imgBase64
  }
}

function selectArea (area: string): string {
  return area === 'z0' ? '' : '-' + area
}

function getToken (qiniuOptions: any): string {
  const accessKey = qiniuOptions.accessKey
  const secretKey = qiniuOptions.secretKey
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const options = {
    scope: qiniuOptions.bucket
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}

const handle = async (ctx: SealGo): Promise<SealGo> => {
  const qiniuOptions = ctx.getConfig('picBed.qiniu')
  if (!qiniuOptions) {
    throw new Error('Can\'t find qiniu config')
  }
  try {
    const imgList = ctx.output
    for (let i in imgList) {
      let base64Image = imgList[i].base64Image || Buffer.from(imgList[i].buffer).toString('base64')
      const options = postOptions(qiniuOptions, imgList[i].fileName, getToken(qiniuOptions), base64Image)
      const res = await ctx.Request.request(options)
      const body = JSON.parse(res)
      if (body.key) {
        delete imgList[i].base64Image
        delete imgList[i].buffer
        const baseUrl = qiniuOptions.url
        const options = qiniuOptions.options
        imgList[i]['imgUrl'] = `${baseUrl}/${body.key}${options}`
      } else {
        ctx.emit('notification', {
          title: '上传失败',
          body: res.body.msg
        })
        throw new Error('Upload failed')
      }
    }
    return ctx
  } catch (err) {
    if (err.message !== 'Upload failed') {
      const error = JSON.parse(err.response.body)
      ctx.emit('notification', {
        title: '上传失败',
        body: error.error
      })
    }
    throw err
  }
}

const config = (ctx: SealGo): PluginConfig[] => {
  let userConfig = ctx.getConfig('picBed.qiniu')
  if (!userConfig) {
    userConfig = {}
  }
  const config = [
    {
      name: 'accessKey',
      type: 'input',
      default: userConfig.accessKey || '',
      required: true
    },
    {
      name: 'secretKey',
      type: 'input',
      default: userConfig.secretKey || '',
      required: true
    },
    {
      name: 'bucket',
      type: 'input',
      default: userConfig.bucket || '',
      required: true
    },
    {
      name: 'url',
      type: 'input',
      default: userConfig.url || '',
      required: true
    },
    {
      name: 'area',
      type: 'input',
      default: userConfig.area || '',
      required: true
    },
    {
      name: 'options',
      type: 'input',
      default: userConfig.options || '',
      required: false
    },
    {
      name: 'path',
      type: 'input',
      default: userConfig.path || '',
      required: false
    }
  ]
  return config
}

export default {
  name: '七牛图床',
  handle,
  config
}
