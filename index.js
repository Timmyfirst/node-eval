const express = require('express')
const consolidate = require('consolidate')

const app = express()

const port = 8000

app.listen(port, err => {
  if (err) {
    console.error('Failed to launch server')
  } else {
    console.info(`Listening ${port}`)
  }
})

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  console.log(req.path);
  res.send('<h1>Hello index</h1>')
})

app.get('/livre', (req, res) => {
  console.log(req.path);
  res.send('#{JSON.stringify(foobar})')
})

app.use('*', function respond404(req, res) {
  console.log(req.path);
  res.status(404).send('Page introuvable')
})
