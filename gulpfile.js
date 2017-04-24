const gulp = require('gulp')
const {spawn} = require('child_process')
const Promise = require('bluebird')

const registry = {}

const startService = (cmd, module, args = []) => new Promise(resolve => {
  if (registry[module] && registry[module].kill) registry[module].kill()
  registry[module] = spawn(cmd, ['index.js'].concat(args), {
    cwd: `./${module}`,
  }).stdout.on('data', msg => {
    const message = msg.toString()
    console.log(message.trim())
    if (message.indexOf('started and listening') > -1) resolve()
  })    
})

gulp.task('api:auth', () => startService('node', 'api-auth'))
gulp.task('api:discovery', () => startService('node', 'api-discovery'))
gulp.task('api:feeds', () => startService('node', 'api-feeds'))
gulp.task('api:series', () => startService('node', 'api-series'))

gulp.task('servers', ['api:auth', 'api:discovery', 'api:feeds', 'api:series'])

gulp.task('default', ['servers'])
