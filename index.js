const consolidate = require('consolidate')
const express = require('express')

const app = express()

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static('public'));

const port = 8000

app.get('*',(req, res, next) => {
  let min = new Date().getMinutes()
  if (min >= 10 && min <= 59){
    console.log('site occupé')
      res.status(503).render('main', {
        partials: {
          section: 'occupied',
        },
        title: 'Node eval',
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
    title: 'Node eval',
  })
})

app.get('/livre', (req, res) => {
  res.send('#{JSON.stringify(foobar})')
})

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