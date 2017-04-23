const {getUrl} = require('../../lib/util')

module.exports = {
  server: {
    name: 'api-auth',
    url: getUrl('AUTH') || 'http://localhost:8000',
    cors: '*',
  },
  services: {
    token: {
      value: 'Token 12345678910',
    },
    discover: {
      url: getUrl('DISCOVER') || 'http://localhost:8010',
    }
  },
}
