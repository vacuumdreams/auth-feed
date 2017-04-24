const fetch = require('node-fetch')

module.exports = () => (url, opts = {}) => 
  fetch(url, opts).then(res => res.json())
