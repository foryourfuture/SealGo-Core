import SealGo from '../../core/SealGo'

const handle = async (ctx: SealGo): Promise<SealGo> => {
  ctx.output.push(...ctx.input)
  return ctx
}

export default {
  handle
}
