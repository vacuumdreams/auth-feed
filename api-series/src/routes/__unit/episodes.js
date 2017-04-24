'use strict'
const {expect} = require('chai')
const {describe, it} = require('mocha')
const sinon = require('sinon')
const Promise = require('bluebird')

const mockClientRes = {}
const mockDiscoverRes = {route: 'http://xy:00'}

const mockReq = {}
const mockRes = {}
mockRes.send = sinon.stub()
mockRes.status = sinon.stub().returns(mockRes)

const mockConf = {}
const mockClient = sinon.stub().returns(Promise.resolve(mockClientRes))
const mockDiscover = sinon.stub().returns(Promise.resolve(mockDiscoverRes))

const episodes = require('../episodes')

describe('Episodes route function', () => {

  beforeEach(() => {
    mockClient.resetHistory()
    mockDiscover.resetHistory()
    mockRes.send.resetHistory()
    mockRes.status.resetHistory()
  })

  it('should return a valid route spec', () => {
    const routeSpec = episodes(mockConf, mockClient, mockDiscover)
    expect(routeSpec).to.be.an.object
    expect(Object.keys(routeSpec)).to.deep.equal(['get'])
    expect(routeSpec.get).to.be.a.function
  })

  describe('when valid discovery response', () => {

    it('should get correct information about feed service', () => {
      const routeSpec = episodes(mockConf, mockClient, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockDiscover.callCount).to.equal(1) 
        expect(mockDiscover.args[0][0]).to.equal('feeds')
      })
    })

    it('should make request to feed service using the discovery response', () => {
      const routeSpec = episodes(mockConf, mockClient, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockClient.callCount).to.equal(1) 
        expect(mockClient.args[0][0]).to.equal('http://xy:00')
      })
    })

  })

  describe('when discovery fails', () => {

    it('should return an error response', () => {
      const mockDiscoverError = sinon.stub().returns(Promise.reject())
      const routeSpec = episodes(mockConf, mockClient, mockDiscoverError)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockDiscoverError.callCount).to.equal(1) 
        expect(mockClient.callCount).to.equal(0)

        expect(mockRes.status.args[0][0]).to.equal(500)
        expect(mockRes.send.args[0][0]).to.deep.equal({message: 'Something went wrong'})
      })
    })

  })

  describe('when receives valid feeds', () => {

    it('should request and structure children feeds', () => {
      const mockRootFeed = [
        {
          _links: [
            {
              _rel: 'navigation/node',
              _href: 'http://xy:00/1',
            },
            {
              _rel: 'navigation/node',
              _href: 'http://xy:00/2',
            },
          ],
        },
      ]

      const mockChildFeedOne = [{
        title: 'One',
        shortSynopsis: 'Lorem ipsum one',
      }]

      const mockChildFeedTwo = [{
        title: 'Two',
        shortSynopsis: 'Lorem ipsum two',
      }]

      const mockClientFeed = sinon.stub()
      mockClientFeed.withArgs('http://xy:00').returns(Promise.resolve(mockRootFeed))
      mockClientFeed.withArgs('http://xy:00/1').returns(Promise.resolve(mockChildFeedOne))
      mockClientFeed.withArgs('http://xy:00/2').returns(Promise.resolve(mockChildFeedTwo))

      const routeSpec = episodes(mockConf, mockClientFeed, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockRes.status.args[0][0]).to.equal(200)
        expect(mockRes.send.args[0][0]).to.deep.equal([{
          title: 'One',
          synopsis: 'Lorem ipsum one',
        }, {
          title: 'Two',
          synopsis: 'Lorem ipsum two',
        }])
      })
    })

    it('should return only valid child feeds', () => {
      const mockRootFeed = [
        {
          _links: [
            {
              _rel: 'other',
              _href: 'http://xy:00/1',
            },
            {
              _rel: 'navigation/node',
              _href: 'http://xy:00/2',
            },
          ],
        },
      ]

      const mockChildFeedOne = [{
        title: 'One',
        shortSynopsis: 'Lorem ipsum one',
      }]

      const mockChildFeedTwo = [{
        title: 'Two',
        shortSynopsis: 'Lorem ipsum two',
      }]

      const mockClientFeed = sinon.stub()
      mockClientFeed.withArgs('http://xy:00').returns(Promise.resolve(mockRootFeed))
      mockClientFeed.withArgs('http://xy:00/1').returns(Promise.resolve(mockChildFeedOne))
      mockClientFeed.withArgs('http://xy:00/2').returns(Promise.resolve(mockChildFeedTwo))

      const routeSpec = episodes(mockConf, mockClientFeed, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockRes.status.args[0][0]).to.equal(200)
        expect(mockRes.send.args[0][0]).to.deep.equal([{
          title: 'Two',
          synopsis: 'Lorem ipsum two',
        }])
      })
    })

    it('should return child feeds in the right format', () => {
      const mockRootFeed = [
        {
          _links: [
            {
              _rel: 'navigation/node',
              _href: 'http://xy:00/1',
            },
          ],
        },
      ]

      const mockChildFeedOne = [{
        title: 'One',
        shortSynopsis: 'Lorem ipsum one',
        otherField: 'some value',
        otherField2: 'some other value',
      }]

      const mockClientFeed = sinon.stub()
      mockClientFeed.withArgs('http://xy:00').returns(Promise.resolve(mockRootFeed))
      mockClientFeed.withArgs('http://xy:00/1').returns(Promise.resolve(mockChildFeedOne))

      const routeSpec = episodes(mockConf, mockClientFeed, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockRes.status.args[0][0]).to.equal(200)
        expect(mockRes.send.args[0][0]).to.deep.equal([{
          title: 'One',
          synopsis: 'Lorem ipsum one',
        }])
      })
    })

  })

  describe('when request to feeds fails', () => {

    it('should return an error response', () => {
      const mockClientError = sinon.stub().returns(Promise.reject())
      const routeSpec = episodes(mockConf, mockClientError, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockDiscover.callCount).to.equal(1) 
        expect(mockClientError.callCount).to.equal(1)

        expect(mockRes.status.args[0][0]).to.equal(500)
        expect(mockRes.send.args[0][0]).to.deep.equal({message: 'Something went wrong'})
      })
    })

  })

  describe('when request to child feeds fails', () => {

    it('should return an error response', () => {
      const mockRootFeed = [
        {
          _links: [
            {
              _rel: 'navigation/node',
              _href: 'http://xy:00/1',
            },
          ],
        },
      ]

      const mockClientFeed = sinon.stub()
      mockClientFeed.withArgs('http://xy:00').returns(Promise.resolve(mockRootFeed))
      mockClientFeed.withArgs('http://xy:00/1').returns(Promise.reject())

      const routeSpec = episodes(mockConf, mockClientFeed, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockDiscover.callCount).to.equal(1) 
        expect(mockClientFeed.callCount).to.equal(2)

        expect(mockRes.status.args[0][0]).to.equal(500)
        expect(mockRes.send.args[0][0]).to.deep.equal({message: 'Something went wrong'})
      })
    })

  })

  describe('when receives invalid feeds', () => {

    it('should return an error response', () => {
      const mockRootFeedInvalid = [{ mock: 'value' }]
      const mockClientInvalid = sinon.stub().returns(Promise.resolve(mockRootFeedInvalid))

      const routeSpec = episodes(mockConf, mockClientInvalid, mockDiscover)
      return routeSpec.get(mockReq, mockRes).then(() => {
        expect(mockDiscover.callCount).to.equal(1) 
        expect(mockClientInvalid.callCount).to.equal(1)

        expect(mockRes.status.args[0][0]).to.equal(500)
        expect(mockRes.send.args[0][0]).to.deep.equal({message: 'Something went wrong'})
      })
    })

  })

})
