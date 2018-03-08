const consolidate = require('consolidate')
const morgan = require('morgan')
const express = require('express')

const app = express()

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static('public'));
app.use(morgan('combined'))

const port = 8000

app.get('*',(req, res, next) => {
  let min = new Date().getMinutes()
  if (min >= 49 && min <= 59){
    console.log('site occupé')
      res.status(503).render('main', {
        partials: {
          section: 'occupied',
        },
        title: 'Site OverBooké ! Revenez plus tard',
      })
    }else{
      next()
    }
})



app.get('/', (req, res) => {
  res.render('main', {
    partials: {
      section: 'welcome',
    },
    title: 'Hello World',
  })
})

app.get('/end', (req, res) => {
  res.render('main', {
    partials: {
      section: 'end',
    },
    title: 'Page END',
  })
})

app.get(/private/, function(req, res) {
  res.status(403).send('Accès interdit')
});

app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})

app.listen(port, err => {
  if (err) {
    console.error('Failed to launch server')
  } else {
    console.info(`Listening ${port}`)
  }
})