const {getUrl} = require('./util')
const {get} = require('./client')

module.exports = conf => {
  if (!conf || !conf.url) throw new Error('No discovery provided in config')
  return serviceName => get(serviceName ? `${conf.url}/${serviceName}` : conf.url)
}
