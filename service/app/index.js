const bodyParser = require('body-parser')
const Color = require('color')
const express = require('express')
const knex = require('knex')
const validator = require('express-validator')

const app = module.exports = express()
const postgres = knex({
    client: 'postgres',
    connection: process.env.DATABASE_URL
})

app.use(bodyParser.json())
app.use(validator())

app.use(function (req, res, next) {
    res.header("X-powered-by", "JavaScript!") // lol
    next()
})

app.get('/', function(req, res){
    res.send('hi!')
})

app.post('/anonymous_votes', function(req, res){
    req.assert('color', "Hex color not valid.").isHexColor();
    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            res.status(400).json({errors: result.array()})
        } else {
            const hex = req.body.color.startsWith('#') ? req.body.color : '#'+req.body.color;
            const rgb = Color(hex).rgb().array()
            postgres('anon_color_vote').insert({r: rgb[0], g: rgb[1], b: rgb[2]}).then(function(){
                res.status(201).json({yay: 'hooray'})
            })
        }
    })
})

app.get('/anonymous_votes', function(req, res){
    postgres.select().from('anon_color_vote').then(function(rows){
        res.status(200).json({
            anonymous_votes: rows
        })
    })
})
