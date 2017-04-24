const {compose, curry, filter, is, map} = require('ramda')
const fs = require('fs')
const Promise = require('bluebird')

const {ErrorFileNotFound, ErrorFileCorrupt} = require('../errors')

const readDir = Promise.promisify(fs.readdir)
const readFile = Promise.promisify(fs.readFile)

const getFileContents = curry((storage, files) =>
  Promise.all(
    compose(
      map(fileName => readFile(`${storage}/${fileName}`)),
      filter(fileName => fileName.indexOf('.json') > 1)
    )(is(Array, files) ? files : [files])
  )
  .catch(() => {
    throw new ErrorFileNotFound('File not found')
  })
)

const bufferToJson = buff => 
  JSON.parse(buff.toString())

module.exports = config => filename => {
  let contents
  if (filename) {
    contents = getFileContents(config.storage, `${filename}.json`)
  } else {
    contents = readDir(config.storage)
      .then(getFileContents(config.storage))
  }
  return contents.then(map(bufferToJson))
  .catch(err => {
    if (err instanceof ErrorFileNotFound) throw err
    throw new ErrorFileCorrupt('File could not be parsed')
  })
}
