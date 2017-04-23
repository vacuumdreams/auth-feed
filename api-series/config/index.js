const {getUrl} = require('../../lib/util')

module.exports = {
  discovery: getUrl('DISCOVER') || 'http://localhost:8010',
  server: {
    name: 'api-series',
    url: getUrl('SERIES') || 'http://localhost:8081',
    cors: '*',
  },
}
