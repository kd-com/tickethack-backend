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
        const departure = req.params.departure
        const arrival = req.params.arrival
        const date = new Date(req.params.date).getTime()
  Trip.find({departure, arrival}).then( response => {
    const data = response.filter(el => el.date.getTime() > date)
    return res.status(200).json({data})
  })

})

module.exports = router;
