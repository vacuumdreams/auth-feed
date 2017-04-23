const {getUrl} = require('../../lib/util')

module.exports = {
  discovery: getUrl('DISCOVER') || 'http://localhost:8010',
  server: {
    name: 'api-feeds',
    url: getUrl('FEEDS') || 'http://localhost:8080',
    cors: '*',
  },
}
