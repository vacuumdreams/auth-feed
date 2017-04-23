const {getReqAuthToken} = require('./util')
const client = require('./client')

module.exports = config => {
  const discover = require('./discover')(config)
  return (req, res, next) => {
    discover('auth')
    .then(res => client(`${res.body.route}/authorize`, getReqAuthToken(req)))
    .then(authorized => authorized ? next() : res.status(401).send())
  }
}
