const authorize = require('./authorize')

module.exports = (config, {token}) => ({
  '/authorize': authorize(config, token),
})
