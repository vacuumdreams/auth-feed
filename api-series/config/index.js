const {getUrl} = require('../../lib/util')

module.exports = {
  server: {
    name: 'api-series',
    url: getUrl('SERIES') || 'http://localhost:8081',
    cors: '*',
  },
  services: {
    discover: {
      url: getUrl('DISCOVER') || 'http://localhost:8010',
    },
  },
}
