const Promise = require('bluebird')
const {get} = require('../../../lib/client')
const {applySpec, compose, equals, filter, head, map, not, pick, prop} = require('ramda')

const getNavNode = compose(get, prop('_href'))
const selectChildren = compose(not, equals('self/device'), prop('_rel'))

const getChildren = compose(
  Promise.all,
  map(getNavNode),
  filter(selectChildren),
  prop('_links'),
  head
)

const toStructure = map(compose(applySpec({
  title: prop('title'),
  synopsis: prop('shortSynopsis'),
}), head))

module.exports = (config, discover) => ({
  get: (req, res) =>
    discover('feeds')
    .then(({route}) => get(route))
    .then(getChildren)
    .then(toStructure)
    .then(result => res.status(200).send(result))
    .catch(() => res.status(500).send({message: 'Something went wrong'}))
})
