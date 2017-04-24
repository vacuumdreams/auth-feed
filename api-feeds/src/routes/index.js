module.exports = (config, {jsonfile}) => ({
  '/': {
    get: (req, res) => 
      jsonfile('Root')
      .then(result => res.status(200).send(result))
      .catch(() => res.status(500).send({message: 'Something went wrong'})),
  },
  '/:id': {
    get: (req, res) => {
      jsonfile(req.params.id)
      .then(result => res.status(200).send(result))
      .catch(() => res.status(500).send({message: 'Something went wrong'}))
    },
  },
})
