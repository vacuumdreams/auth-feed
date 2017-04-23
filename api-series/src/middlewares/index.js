const authMiddleware = require('../../../lib/authmw')

module.exports = config => ([
  authMiddleware(config),
])
