const Promise = require('bluebird')
const {applySpec, compose, equals, filter, head, map, prop} = require('ramda')

const getNavNode = client => compose(client, prop('_href'))
const selectChild = compose(equals('navigation/node'), prop('_rel'))

const getChildren = client => compose(
  Promise.all,
  map(getNavNode(client)),
  filter(selectChild),
  prop('_links'),
  head
)

const toStructure = map(compose(applySpec({
  title: prop('title'),
  synopsis: prop('shortSynopsis'),
}), head))

module.exports = (config, client, discover) => ({
  get: (req, res) =>
    discover('feeds')
    .then(({route}) => client(route))
    .then(getChildren(client))
    .then(toStructure)
    .then(result => res.status(200).send(result))
    .catch(() => res.status(500).send({message: 'Something went wrong'})),
})
