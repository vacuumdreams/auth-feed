const host = process.env.API_DISCOVER_HOST  || 'http://localhost'
const port = process.env.API_DISCOVER_PORT || '8010'

module.exports = {
  server: {
    name: 'api-discover',
    url: `${host}:${port}`,
    cors: '*',
  },
}
