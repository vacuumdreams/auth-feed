'use strict'
const {expect} = require('chai')
const {describe, it} = require('mocha')

const token = require('../token')

describe('Token service', () => {

  it('should return truthy value if token matches', () => {
    expect(token({value: 'abc'})('abc')).to.be.true
  })

  it('should return falsy value if token matches', () => {
    expect(token({value: 'abc'})(12)).to.be.false
  })

  it('should return falsy value if config is invalid', () => {   
    expect(token({})('abc')).to.be.false
  })

})
