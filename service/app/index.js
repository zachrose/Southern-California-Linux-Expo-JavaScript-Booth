const bodyParser = require('body-parser')
const Color = require('color')
const cors = require('cors')
const crypto = require('crypto')
const express = require('express')
const knex = require('knex')
const validator = require('express-validator')

const app = module.exports = express()
const corsWhitelist = [
    'http://southerncalifornialinuxexpojavascriptbooth.org',
    'https://southerncalifornialinuxexpojavascriptbooth.org',
    'http://localhost:8000'
]
const corsOptions = {
    origin: function(origin, callback) {
        const isOk = corsWhitelist.indexOf(origin) !== -1
        console.log(origin+' is '+(isOk? 'ok' : 'not ok'))
        callback(isOk ? null : 'Bad Request', isOk)
    }
}
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

app.options('*', cors(corsOptions))

app.get('/', function(req, res){
    res.send('hi!')
})

app.post('/anonymous_votes', cors(corsOptions), function(req, res){
    req.assert('color', "Hex color not valid.").isHexColor();
    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            res.status(400).json({errors: result.array()})
        } else {
            const hex = req.body.color.startsWith('#') ? req.body.color : '#'+req.body.color;
            const rgb = Color(hex).rgb().array()
            postgres('anonymous_vote')
                .insert({r: rgb[0], g: rgb[1], b: rgb[2]})
                .then(function(){
                    res.status(201).json({yay: 'hooray'})
                })
        }
    })
})

app.get('/anonymous_votes', cors(corsOptions), function(req, res){
    postgres.select().from('anonymous_vote').then(function(rows){
        res.status(200).json({
            anonymous_votes: rows
        })
    })
})

app.post('/identified_votes', cors(corsOptions), function(req, res){
    console.log('working with...'+req.body)
    req.assert('color', "Hex color not valid.").isHexColor();
    req.assert('email', "Email not valid.").isEmail();
    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            res.status(400).json({errors: result.array()})
        } else {
            const hex = req.body.color.startsWith('#') ? req.body.color : '#'+req.body.color;
            const rgb = Color(hex).rgb().array()
            const record = {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
                email: req.body.email,
                email_verification_code: crypto.randomBytes(128).toString('base64')
            }
            postgres('identified_vote')
                .insert(record)
                .then(function(){
                    res.status(201).json({yay: 'hooray'})
                })
        }
    })
})

app.get('/email_verification/:code', function(req, res){
    req.assert('code', "Verification code required.").isBase64()
    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            res.status(400).json({errors: result.array()})
        } else {
            postgres('identified_vote')
                .where('email_verification_code', '=', req.params.code)
                .update({
                    email_verified: true
                })
                .then(function(){
                    res.status(200).json({thanks: "we've got your email"})
                })
        }
    })
})
