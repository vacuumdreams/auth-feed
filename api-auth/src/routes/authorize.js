module.exports = (config, token) => ({
  get: (req, res) => {
    if (token(req.headers.authorization)) {
      res.status(200).send('OK')
    } else {
      res.status(401).send('Not Authorized')
    }
  },
})
