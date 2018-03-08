const express = require('express')
const consolidate = require('consolidate')

const app = express()

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static('public'));

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

app.get('/end', (req, res) => {
  res.render('main', {
    partials: {
      section: 'end',
    },
    title: 'Node eval',
  })
})

app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})
