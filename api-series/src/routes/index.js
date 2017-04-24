const episodes = require('./episodes')

module.exports = (config, {discover}) => ({
  '/episodes': episodes(config, discover),
})
