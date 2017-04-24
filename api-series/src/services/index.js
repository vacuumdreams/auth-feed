module.exports = ({client, discover}) => ({
  client: require('../../../lib/client')(client),
  discover: require('../../../lib/discover')(discover),
})

