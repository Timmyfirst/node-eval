const consolidate = require('consolidate')
const morgan = require('morgan')
const express = require('express')

const fakeDb = require('./helpers/fake-db.js')
const fs = require('fs');
const readJson = require('./readJson')

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

app.listen(port, err => {
  if (err) {
    console.error('Failed to launch server')
  } else {
    console.info("Listening "+port)
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
app.get('/liste', (req, res) => {

    readJson('forex.json')
        .then(result => console.log(result.rates))
        // recup k v
        .then(devises => devises.map(devise => console.log(devise)))

        .catch(err => {

        })



    const data = fakeDb.getAll();
    console.log(getForexJson())

    data.then((list)=>{
        console.log(getForexJson());
       res.render('main', {
           partials: {
               main: 'liste',
           },
           title: 'Liste des enregistrements',
           items: list

       })
    })
})

app.get('/liste/:id', (req, res) => {
    const name = req.query.name;
    const priceEur = req.query.priceEur;


    res.render('main', {
        partials: {
            main: 'listeDetail',
        },
        title: 'Liste des enregistrements',
        name: name,
        priceEur: priceEur,

    })

})


function getForexJson() {
    let forexJson = '';
    fs.readFile('helpers/forex.json','utf8', (err, data) => {
        if (err) throw err;
        forexJson = JSON.parse(data);
    });

    return forexJson;
}

app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})
