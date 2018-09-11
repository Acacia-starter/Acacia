import userConfig from '../../akaru.config'
import baseConfig from './baseConfig'
import deepmerge from 'deepmerge'

export default (env = process.env.NODE_ENV) => {
  let { envs: userConfigEnvs, ...realUserConfig } = userConfig

  let { envs: baseConfigsEnvs, ...realBaseConfig } = baseConfig

  const merges = [realBaseConfig, baseConfigsEnvs[env], realUserConfig]

  if (userConfigEnvs && userConfigEnvs[env]) {
    merges.push(userConfigEnvs[env])
  }

  return deepmerge.all(merges)
}
