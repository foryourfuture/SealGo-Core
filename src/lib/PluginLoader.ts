import SealGo from '../core/SealGo'
import fs from 'fs-extra'
import path from 'path'
import resolve from 'resolve'

class PluginLoader {

  ctx: SealGo
  list: string[]
  constructor (ctx: SealGo) {
    this.ctx = ctx
    this.list = []
    this.init()
  }

  init (): void {
    const packagePath = path.join(this.ctx.baseDir, 'package.json')
    if (!fs.existsSync(packagePath)) {
      const pkg = {
        name: 'sealgo-plugins',
        description: 'sealgo-plugins',
        repository: 'https://github.com/foryourfuture/SealGo-Core',
        license: 'MIT'
      }
      fs.writeFileSync(packagePath, JSON.stringify(pkg), 'utf8')
    }
  }

  // get plugin entry
  resolvePlugin (ctx: SealGo, name: string): string {
    try {
      return resolve.sync(name, { basedir: ctx.baseDir })
    } catch (err) {
      return path.join(ctx.baseDir, 'node_modules', name)
    }
  }

  // load all third party plugin
  load (): void | boolean {
    const packagePath = path.join(this.ctx.baseDir, 'package.json')
    const pluginDir = path.join(this.ctx.baseDir, 'node_modules/')
      // Thanks to hexo -> https://github.com/hexojs/hexo/blob/master/lib/hexo/load_plugins.js
    if (!fs.existsSync(pluginDir)) {
      return false
    }
    const json = fs.readJSONSync(packagePath)
    const deps = Object.keys(json.dependencies || {})
    const devDeps = Object.keys(json.devDependencies || {})
    const modules = deps.concat(devDeps).filter((name: string) => {
      if (!/^sealgo-plugin-|^@[^/]+\/sealgo-plugin-/.test(name)) return false
      const path = this.resolvePlugin(this.ctx, name)
      return fs.existsSync(path)
    })
    for (let i in modules) {
      this.list.push(modules[i])
      if (this.ctx.config.sealgoPlugins[modules[i]] || this.ctx.config.sealgoPlugins[modules[i]] === undefined) {
        try {
          this.getPlugin(modules[i]).register()
          const plugin = `sealgoPlugins[${modules[i]}]`
          this.ctx.saveConfig(
            {
              [plugin]: true
            }
          )
        } catch (e) {
          this.ctx.log.error(e)
          this.ctx.emit('notification', {
            title: `Plugin ${modules[i]} Load Error`,
            body: e
          })
        }
      }
    }
  }

  // get plugin by name
  getPlugin (name: string): any {
    const pluginDir = path.join(this.ctx.baseDir, 'node_modules/')
    return require(pluginDir + name)(this.ctx)
  }

  // get plugin name list
  getList (): string[] {
    return this.list
  }
}
export default PluginLoader
