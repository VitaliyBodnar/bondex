const express = require('express')
const path = require('path')

const { create } = require('./app/app-create');
const { activate } = require('./app/app-activate');

const PORT = process.env.PORT || 5001

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/create', (req, res) => {
    create();
    res.render('pages/index')
  })
  .get('/activate', (req, res) => {
    activate();
    res.render('pages/index')
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
