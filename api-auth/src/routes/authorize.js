module.exports = (config, token) => ({
  get: (req, res) => {
    if (token(req.headers.authorization)) {
      res.status(200).send({message: 'OK'})
    } else {
      res.status(401).send({message: 'Not Authorized'})
    }
  },
})
