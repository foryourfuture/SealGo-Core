import SealGo from '../../core/SealGo'
import ImgFromPath from './path'
import ImgFromBase64 from './base64'

export default (ctx: SealGo): void => {
  ctx.helper.transformer.register('path', ImgFromPath)
  ctx.helper.transformer.register('base64', ImgFromBase64)
}
