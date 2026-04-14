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

      // Vérifie si le voyage est déjà dans le panier
      return Cart.findOne({ "trips._id": trip._id })
        .then((dbData) => {
          if (dbData !== null) {
            return res.json({
              result: false,
              error: "Le voyage est déjà dans votre panier",
            });
          }

          // Ajoute l'objet complet du trip dans le panier
          const newCart = new Cart({
            isBook: false,
            trips: [trip], // ← objet complet
          });

          return newCart.save();
        })
        .then((savedCart) => {
          res.json({ result: true, cart: savedCart });
        });
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