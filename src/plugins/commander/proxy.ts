import SealGo from '../../core/SealGo'

export default {
  handle: (ctx: SealGo): void => {
    const cmd = ctx.cmd
    cmd.program
      .option('-p, --proxy <url>', 'set proxy for uploading', (proxy: string) => {
        ctx.setConfig({
          'picBed.proxy': proxy
        })
        ctx.Request.init()
      })
  }
}
