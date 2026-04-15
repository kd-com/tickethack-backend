var express = require("express");
var router = express.Router();
const Cart = require("../models/cart");
const Trip = require("../models/trip"); // ← réintégration du modèle Trip



// ajout de voyage dans le panier
router.post("/:id", (req, res) => {
  const tripId = req.params.id;

  Trip.findById(tripId)
    .then((trip) => {
      if (!trip) {
        return res.json({ result: false, error: "Voyage introuvable" });
      }
      // vérifie si le trip est déjà dans un panier
      return Cart.findOne({"trips._id": trip._id})
        .then((tripAlreadyInCart) => {
          if(tripAlreadyInCart) {
            return res.json({result: false, error: "Le voyage est déjà dans votre panier"})
          }
          // cherche un panier non validé
          return Cart.findOne({isBook: false})
          .then((cart) => {
            // on trouve un panier en false
            if(cart) {
              cart.trips.push(trip)
              return cart.save();
            } else {
              // il n'y a pas de panier en false
              const newCart = new Cart({isBook: false, trips: [trip]});
              return newCart.save()
            }
          })
          .then((savedCart) => {
            res.json({result: true, cart : savedCart})
          })
        })
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ result: false, error: "Erreur serveur" });
    });
});

// afficher le panier
router.get('/', (req, res) => {
    Cart.find().lean()
    .then((allTrips) => {
        res.json({allTrips})
    })
})

// delete un voyage
router.delete('/delete/:id', (req, res) => {
    const tripId = req.params.id;
    // on recherche le voyage à supp
    Cart.findOne({"trips._id": tripId})
    .then((existingCart) => {
        if(!existingCart) {
            return res.json({return: false, error: "Voyage non trouvé dans le panier"})
        }
        return Cart.updateOne(
            {"trips._id": tripId},
            {$pull: {trips: {_id: tripId}}}
        );
    })
    .then(() => {
        res.json({result: true, message: "Voyage supprimé du panier"})
    })
})
// supprmier tout le panier
router.delete('/delete', (req, res) => {
    Cart.deleteMany()
    .then(() => {
        console.log('Tous les trajets supprimés')
        return Cart.find().lean()
    })
    .then((allTrips) => {
        res.json({allTrips})
    })
})
module.exports=router;