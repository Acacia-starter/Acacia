import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import ZipPlugin from 'zip-webpack-plugin'

class WebpackConfig {
  constructor () {
    this.config = {}
  }

  setMode (mode) {
    this.mode = mode
    this.config.mode = mode

    return this
  }

  isProduction () {
    return this.mode === 'production'
  }

  setPaths (paths) {
    this.paths = paths

    return this
  }

  setEnvs (envs) {
    this.envs = envs

    return this
  }

  setEntry (name, path) {
    if (!this.config.entry) this.config.entry = {}

    this.config.entry[name] = path

    return this
  }

  setOutput (output) {
    this.config.output = {
      ...this.config.ouput,
      ...output
    }

    return this
  }

  setStats (stats) {
    this.config.stats = stats

    this.config.devServer = {
      stats
    }

    return this
  }

  zipBuild (path, filename) {
    this.addPlugin(new ZipPlugin({
      path,
      filename
    }))
  }

  setOutputName (outputName) {
    if (!this.config.output) this.config.output = {}

    this.config.output.filename = outputName

    return this
  }

  setOutputPath (outputPath) {
    if (!this.config.output) this.config.output = {}

    this.config.ouput.path = outputPath

    return this
  }

  setPublicPath (publicPath) {
    this.config.ouput.publicPath = publicPath

    return this
  }

  addRule (rule) {
    if (!this.config.module) this.config.module = {}
    if (!this.config.module.rules) this.config.module.rules = []

    this.config.module.rules.push(rule)

    return this
  }

  addPlugin (pluginInstance) {
    if (!this.config.plugins) this.config.plugins = []

    this.config.plugins.push(pluginInstance)

    return this
  }

  copyStatic (staticDirectoryPath) {
    this.addPlugin(new CopyWebpackPlugin([staticDirectoryPath]))

    return this
  }

  cleanOutput (path = this.config.output.path) {
    this.addPlugin(new CleanWebpackPlugin(path, {
      root: this.paths.base(),
      verbose: true
    }))

    return this
  }

  getConfig () {
    return this.config
  }
}

export default new WebpackConfig()
