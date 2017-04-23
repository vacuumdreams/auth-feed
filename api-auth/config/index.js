const {getUrl} = require('../../lib/util')

module.exports = {
  discovery: getUrl('DISCOVER') || 'http://localhost:8010',
  server: {
    name: 'api-auth',
    url: getUrl('AUTH') || 'http://localhost:8000',
    cors: '*',
  },
  services: {
    token: {
      value: 'Token 12345678910',
    },
  },
}
