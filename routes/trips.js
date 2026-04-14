var express = require('express');
var router = express.Router();
const fetch = require('node-fetch')
const  Trip = require('../models/trip')


// get All trips
router.get('/trips : ', (req, res) => {
    Trip.find().then (response => {
        res.status(200).json({AllTrips: response})
    })
})

router.get('/trips/:departure/:arrival/:date', (req, res) => {
  const {departure, arrival, date} = req.params
  Trip.find({departure, arrival}).then( response => {
    res.status(200).json({response})
  })

})

module.exports = router;
