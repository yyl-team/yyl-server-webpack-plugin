const start = require('./compiler')
start().then((app) => {
  app.listen(5000)
})