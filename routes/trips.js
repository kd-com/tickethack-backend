var express = require('express');
var router = express.Router();
const moment = require('moment')
const  Trip = require('../models/trip')


// get All trips
router.get('/', (req, res) => {
    Trip.find().then (response => {
        res.status(200).json({AllTrips: response})
    })
})

router.get('/:departure/:arrival/:date', (req, res) => {
  const { departure, arrival, date } = req.params

  console.log('Params reçus:', departure, arrival, date)

  Trip.find({ departure, arrival })
    .then(response => {
      console.log('Trajets trouvés:', response)

      const filteredTrips = response.filter(trip => {
        const tripDate = moment(trip.date).format('YYYY-MM-DD')
        console.log('Comparaison:', tripDate, '===', date)
        return tripDate === date
      })
      res.json({ filteredTrips })
    })
})

module.exports = router;
