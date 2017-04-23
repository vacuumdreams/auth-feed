const path = require('path')
const {getUrl} = require('../../lib/util')

module.exports = {
  server: {
    name: 'api-feeds',
    url: getUrl('FEEDS') || 'http://localhost:8080',
    cors: '*',
  },
  services: {
    discover: {
      url: getUrl('DISCOVER') || 'http://localhost:8010',
    },
    jsonfile: {
      storage: path.join(__dirname, '../data'),
    },
  },
}
