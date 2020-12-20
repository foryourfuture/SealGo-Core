import chalk from 'chalk'
import SealGo from '../core/SealGo'
import dayjs from 'dayjs'
import fs from 'fs-extra'
import path from 'path'
import util from 'util'

class Logger {
  level: {
    [propName: string]: string
  }
  ctx: SealGo
  constructor (ctx: SealGo) {
    this.level = {
      success: 'green',
      info: 'blue',
      warn: 'yellow',
      error: 'red'
    }
    this.ctx = ctx
  }
  protected handleLog (type: string, msg: string | Error): string | Error | undefined {
    // if configPath is invalid then this.ctx.config === undefined
    // if not then check config.silent
    if (this.ctx.config === undefined || !this.ctx.getConfig('silent')) {
      let log = chalk[this.level[type]](`[SealGo ${type.toUpperCase()}]: `)
      log += msg
      console.log(log)
      process.nextTick(() => {
        this.handleWriteLog(type, msg, this.ctx)
      })
      return msg
    } else {
      return
    }
  }

  protected handleWriteLog (type: string, msg: string | Error, ctx: SealGo): void {
    try {
      const logLevel = this.ctx.getConfig('settings.logLevel')
      const logPath = this.ctx.getConfig('settings.logPath') || path.join(ctx.baseDir, './sealgo.log')
      if (this.checkLogLevel(type, logLevel)) {
        const sealgoLog = fs.createWriteStream(logPath, { flags: 'a', encoding: 'utf8' })
        let log = `${dayjs().format('YYYY-MM-DD HH:mm:ss')} [SealGo ${type.toUpperCase()}] ${msg}`
        let logger = new console.Console(sealgoLog)
        if (typeof msg === 'object' && type === 'error') {
          log += `\n------Error Stack Begin------\n${util.format(msg.stack)}\n-------Error Stack End-------`
        }
        logger.log(log)
        sealgoLog.destroy()
        logger = null
      }
    } catch (e) {
      console.log(e)
    }
  }

  protected checkLogLevel (type: string, level: undefined | string | string[]): boolean {
    if (level === undefined || level === 'all') {
      return true
    }
    if (Array.isArray(level)) {
      return level.some((item: string) => (item === type || item === 'all'))
    } else {
      return type === level
    }
  }

  success (msg: string | Error): string | Error | undefined {
    return this.handleLog('success', msg)
  }

  info (msg: string | Error): string | Error | undefined {
    return this.handleLog('info', msg)
  }

  error (msg: string | Error): string | Error | undefined {
    return this.handleLog('error', msg)
  }

  warn (msg: string | Error): string | Error | undefined {
    return this.handleLog('warn', msg)
  }
}

export default Logger
