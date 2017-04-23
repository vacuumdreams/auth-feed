const {getUrl} = require('./util')
const {get} = require('./client')

module.exports = config => {
  const discoveryUrl = config.discovery || getUrl('DISCOVERY') || 'http://localhost:8010'
  return serviceName => get(serviceName ? `${discoveryUrl}/${serviceName}` : discoveryUrl)
}
