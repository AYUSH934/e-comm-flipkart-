const express = require('express')
const liveScore = require('../Model/liveScore')

const router = express.Router()

router.get('/',async(req,res)=>{
    console.log(req)
    try{
      const Livescore = await liveScore.find()
      res.status(200).json(Livescore)
    }catch(err){

        console.log(err)
    }
})

module.exports = router