const express = require('express')
const consolidate = require('consolidate')
const morgan = require('morgan')

const app = express()

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static('public'));
app.use(morgan('combined'))

const port = 8000

app.listen(port, err => {
  if (err) {
    console.error('Failed to launch server')
  } else {
    console.info(`Listening ${port}`)
  }
})

app.get('/', (req, res) => {
  res.render('main', {
    partials: {
      section: 'welcome',
    },
    title: 'Node eval',
  })
})

app.get('/livre', (req, res) => {
  res.send('#{JSON.stringify(foobar})')
})

app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})
