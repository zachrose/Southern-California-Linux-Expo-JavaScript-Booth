const express = require('express')

const app = module.exports = express()

app.get('/', function(req, res){
    res.send('hi!')
})
