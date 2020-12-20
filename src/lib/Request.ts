import SealGo from '../core/SealGo'
import request from 'request-promise-native'

class Request {
  ctx: SealGo
  request: typeof request
  constructor (ctx: SealGo) {
    this.ctx = ctx
    this.init()
  }

  init (): void {
    let options = {
      jar: request.jar()
    }
    const proxy = this.ctx.getConfig('picBed.proxy')
    if (proxy) {
      options['proxy'] = proxy
    }
    this.request = request.defaults(options)
  }
}

export default Request
