require('dotenv').config()
const http = require('http')
const app = require('./app')
const port = process.env.PORT
const host  = process.env.HOST


const server = http.createServer(app).listen(port,()=>{
    console.log(`server started on ${host} in ${port}`)
})

