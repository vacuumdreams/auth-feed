const client = require('./client')()

module.exports = conf => {
  if (!conf || !conf.url) throw new Error('No discovery provided in config')
  return serviceName => client(serviceName ? `${conf.url}/${serviceName}` : conf.url)
}
