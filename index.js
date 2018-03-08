const express = require('express')
const consolidate = require('consolidate')
const fakeDb = require('./helpers/fake-db.js')
const fs = require('fs');
const readJson = require('./readJson')
const bodyParser = require('body-parser')

const app = express()
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

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

app.get('/liste', (req, res) => {

    readJson('forex.json')
        .then(result => console.log(result.rates.split(':')))
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

app.get('/add', (req, res) => {



        res.render('main', {
            partials: {
                main: 'listeAjout',
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
                main: 'listeAjout',
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

app.use('*', function respond404(req, res) {
  console.log(req.path);
  res.status(404).send('Page introuvable')
})

