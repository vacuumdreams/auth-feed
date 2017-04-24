'use strict'
const {expect} = require('chai')
const {describe, it} = require('mocha')

const fs = require('fs')

const jsonfile = require('../jsonfile')

const mockConf = { storage: __dirname }
const mockFile = 'mock'

const {ErrorFileNotFound, ErrorFileCorrupt} = require('../../errors')

describe('Jsonfile service', () => {

  describe('with valid json content', () => {
    it('should return the file contents', () => {
      fs.writeFileSync(`${mockConf.storage}/${mockFile}.json`, JSON.stringify({key: 'value'}))
      return jsonfile(mockConf)(mockFile).then(res => {
        expect(res).to.deep.equal([{key: 'value'}])
        fs.unlinkSync(`${mockConf.storage}/${mockFile}.json`)
      })
    })
  })

  describe('with multiple files', () => {
    it('should return the file contents from folder reading only files with json extension', () => {
      fs.writeFileSync(`${mockConf.storage}/${mockFile}.json`, JSON.stringify({key: 'value'}))
      fs.writeFileSync(`${mockConf.storage}/${mockFile}2.json`, JSON.stringify({key2: 'value2'}))
      return jsonfile(mockConf)().then(res => {
        expect(res).to.deep.equal([{key: 'value'}, {key2: 'value2'}])
        fs.unlinkSync(`${mockConf.storage}/${mockFile}.json`)
        fs.unlinkSync(`${mockConf.storage}/${mockFile}2.json`)
      })
    })
  })

  describe('with invalid content', () => {
    it('should throw an error', () => {
      fs.writeFileSync(`${mockConf.storage}/${mockFile}.json`, 'invalid json')
      return jsonfile(mockConf)(mockFile).catch(err => {
        expect(err).to.be.instanceof(ErrorFileCorrupt)
        expect(err.message).to.equal('File could not be parsed')
        fs.unlinkSync(`${mockConf.storage}/${mockFile}.json`)
      })
    })
  })

  describe('when file is missing', () => {
    it('should throw an error', () => {
      return jsonfile(mockConf)(mockFile).catch(err => {
        expect(err).to.be.instanceof(ErrorFileNotFound)
        expect(err.message).to.equal('File not found')
      })      
    })
  })

})
