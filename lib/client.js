const fetch = require('node-fetch')

module.exports = {
  get: (url, opts = {}) => fetch(url, opts).then(res => res.json()),
}
