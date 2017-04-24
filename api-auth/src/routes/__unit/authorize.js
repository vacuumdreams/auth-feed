'use strict'
const {expect} = require('chai')
const {describe, it} = require('mocha')
const sinon = require('sinon')

const authorize = require('../authorize')

const mockConf = {}

const mockRes = {}
mockRes.send = sinon.stub()
mockRes.status = sinon.stub().returns(mockRes)

describe('Authorization route function', () => {

  beforeEach(() => {
    mockRes.send.resetHistory()
    mockRes.status.resetHistory()
  })

  it('should return a valid route spec', () => {
    const mockToken = sinon.stub().returns(true)
    const routeSpec = authorize(mockConf, mockToken)
    expect(routeSpec).to.be.an.object
    expect(Object.keys(routeSpec)).to.deep.equal(['get'])
    expect(routeSpec.get).to.be.a.function
  })

  describe('when receiving a valid token', () => {
    const mockReq = {
      headers: { authorization: 'valid token' },
    }

    it('should send a success response', () => {
      const mockToken = sinon.stub().returns(true)
      const routeSpec = authorize(mockConf, mockToken)
      routeSpec.get(mockReq, mockRes)
      expect(mockRes.status.args[0][0]).to.equal(200)
      expect(mockRes.send.args[0][0]).to.deep.equal({message: 'OK'})
    })
  })

  describe('when receiving an invalid token', () => {
    const mockReq = {
      headers: { authorization: 'invalid token' },
    }    

    it('should send an error response', () => {
      const mockToken = sinon.stub().returns(false)
      const routeSpec = authorize(mockConf, mockToken)
      routeSpec.get(mockReq, mockRes)
      expect(mockRes.status.args[0][0]).to.equal(401)
      expect(mockRes.send.args[0][0]).to.deep.equal({message: 'Not Authorized'})
    })
  })

  describe('without authorization header', () => {
    const mockReq = {
      headers: {},
    }   

    it('should send an error response', () => {
      const mockToken = sinon.stub().returns(false)
      const routeSpec = authorize(mockConf, mockToken)
      routeSpec.get(mockReq, mockRes)
      expect(mockRes.status.args[0][0]).to.equal(401)
      expect(mockRes.send.args[0][0]).to.deep.equal({message: 'Not Authorized'})      
    }) 
  })

})

