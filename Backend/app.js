const express = require('express')
const cors = require('cors')
const userauth = require('./API/Routes/userauth')
const product = require('./API/Routes/productRouter')
const usercart = require('./API/Routes/Usercart')
const userwishlist = require('./API/Routes/Userwishlist')

const app = express()

const body_parser = require('body-parser')
const { default: mongoose } = require('mongoose')



const db1 = 'mongodb+srv://sharmaji93400:Ayush%40123@cluster0.u7epr.mongodb.net/cricbuzz-clone'

mongoose.connect(db1).then(()=>{
    console.log('connnect success')
}).catch(err=>{
    console.log(err)
})

app.use(cors())
app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json({extended:true}))


app.use('/auth',userauth)
app.use('/auth',product)
app.use('/auth',usercart)
app.use('/auth',userwishlist)


module.exports = app