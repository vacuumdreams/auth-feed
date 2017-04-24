'use strict'
const {expect} = require('chai')
const {describe, it} = require('mocha')
const sinon = require('sinon')
const Promise = require('bluebird')

const mockConf = {}
const mockDiscover = sinon.stub().returns(Promise.resolve({route: 'http://xy:1'}))

const episodes = require('../episodes')

describe('Episodes route', () => {
  it('should pass', () => {
    expect(episodes(mockConf, mockDiscover)).to.be.an.object
  })
})
