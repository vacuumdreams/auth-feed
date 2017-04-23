const {assoc, merge, reduce} = require("ramda")

const services = [
  {
    name: "auth",
    route: "http://localhost:8000",
  },
  {
    name: "discovery",
    route: "http://localhost:8010",
  },
  {
    name: "feeds",
    route: "http://localhost:8080",
  },
  {
    name: "series",
    route: "http://localhost:8081",
  },
]

// builds an object to provide access to routes by service name
const addServiceRoute = (acc, service) => 
  merge(acc, assoc(`/${service.name}`, {
    get: (req, res) => res.status(200).send(service)
  }, {}))

const serviceRoutes = reduce(addServiceRoute, {}, services)

module.exports = config => merge(serviceRoutes, {
  '/': {
    get: (req, res) => res.status(200).send(services)
  }
})
