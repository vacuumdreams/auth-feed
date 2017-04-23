const {get} = require('./client')

module.exports = config => {
  const discover = require('./discover')({url: config.services.discover.url})
  return (req, res, next) => 
    discover('auth')
    .then(({route}) => get(`${route}/authorize`, {
      headers: req.headers,
    }))
    .then(result => 
      result.message === 'OK' ? next() : res.status(401).send({message: result.message})
    )
    .catch(() => res.status(500).send({message: 'Something went wrong'})) 
}
