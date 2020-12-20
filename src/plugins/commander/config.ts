import SealGo from '../../core/SealGo'

export default {
  handle: (ctx: SealGo): void => {
    const cmd = ctx.cmd
    cmd.program
      .option('-c, --config <path>', 'set config path')
  }
}
