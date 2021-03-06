module.exports.getUrl = name => {
  const host = process.env[`API_${name}_HOST`]
  const port = process.env[`API_${name}_PORT`]
  return host && port && `${host}:${port}`
}

