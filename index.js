const consolidate = require('consolidate')
const morgan = require('morgan')
const express = require('express')

const fakeDb = require('./helpers/fake-db.js')
const fs = require('fs');
const readJson = require('./readJson')
const bodyParser = require('body-parser')

const app = express()
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');

app.set('views', __dirname + '/views');
app.use('/static', express.static('public'));
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

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

app.get('/liste/:id', (req, res) => {
  const name = req.query.name;
  const priceEur = req.query.priceEur;

  res.render('main', {
    partials: {
        section: 'listeDetail',
    },
    title: 'Liste des enregistrements',
    name: name,
    priceEur: priceEur,
  })
})

app.get('/liste/:currency?', (req, res) => {
  cur = req.query.currency;

  if( cur == null ){
    cur = 'EUR';
  }

  const currency = cur

  const p1 = readJson('forex.json')
      .then(result => {
        return Object.keys(result.rates).map(function(key){
          result.rates[key]
          return {'rate': result.rates[key], 'currency': key}
        });
      })
      .catch(err => {

      })

  const dataPromise = fakeDb.getAll();

  const p2 = dataPromise;

  const arrayResult = [];

  dataPromise
  .then(items => {
    items.forEach(function(item){
      arrayResult.push(item);
    })
  })
  .then(function(value) {
    console.log(arrayResult);
  })


  Promise.all([p1, p2]).then(function(results) {
    const devises = results[0]
    const list = results[1]

    let newPrice = 1;
    devises.forEach(function(myPrice){
      if( myPrice.currency == currency ){
        newPrice = parseFloat(myPrice.rate)
      }
    })

    const listProduct = []
    list.forEach(function(res_list){
      res_list.priceEur = priceRound(parseFloat(res_list.priceEur)*parseFloat(newPrice), 2) + ' ' + currency
    })

    res.render('main', {
       partials: {
           section: 'liste',
           aside: 'devises'
       },
       title: 'Liste des enregistrements',
       items: arrayResult,
       devises: devises
    })
  }).catch(err => console.log(err))
})


app.get('/add', (req, res) => {
  res.render('main', {
    partials: {
        section: 'listeAjout',
    },
    title: 'Ajouté un élément',
  })
})


app.post('/add', (req, res, next) => {
  console.log(req.body);
  const result = {name: req.body.nameElement, priceEur:req.body.price}
  const addDB= fakeDb.add(result);

  addDB.then((data)=>{
    console.log(getForexJson());
    res.render('main', {
      partials: {
          section: 'listeAjout',
      },
      title: 'enregistré',
    })
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

function priceRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}


app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})
