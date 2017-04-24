const episodes = require('./episodes')

module.exports = (config, {client, discover}) => ({
  '/episodes': episodes(config, client, discover),
})
