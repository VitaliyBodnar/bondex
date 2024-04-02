const express = require('express')
const path = require('path')

const { runProcesses } = require('./app/app-full.js')

const PORT = process.env.PORT || 5001;

runProcesses();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
