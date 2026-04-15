var express = require("express");
var router = express.Router();
const Cart = require("../models/cart");
const Trip = require("../models/trip"); // ← réintégration du modèle Trip



// ajout de voyage dans le panier
router.post("/:id", async (req, res) => {
  try {
    const tripId = req.params.id;
    // 1 on cherche le voyage
    const trip = await Trip.findById(tripId);
    if(!trip) {
      return res.json({result: false, error: "Voyage introuvable"})
    }
    // 2 on cherche un panier non validé
    const cart = await Cart.findOne({isBook: false})
    if(cart) {
      // 3 vérifie que le voyage n'est pas dans le panier
      const alreadyIn = cart.trips.some(trip => trip.toString() === tripId)
      if(!alreadyIn) {
        cart.trips.push(trip._id);
        await cart.save();
      } else {
        console.log('Voyage déjà dans le panier')
      }
    } else {
      // 4 on créé un nouveau panier
      await new Cart({isBook: false, trips:trip._id}).save()
    }
    // 5 renvoi le panier coplet et populé
    const updatedCart = await Cart.findOne({isBook: false}).populate('trips');
    res.json({result:true, cart: updatedCart})
  } catch(err) {
  console.log(err)
  res.status(500).json({result:false, error:"erreur serveur"})
  }
});

// afficher le panier
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({isBook: false}).populate('trips');
    if(!cart) {
      return res.json({result: false, error: "Aucun panier trouvé"});
    } else {
      res.json({result: true, cart})
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({result:false, error: "Erreur serveur"})
  }
})

// delete un voyage
router.delete('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;

    const cart = await Cart.findOne({ isBook: false });
    if (!cart) return res.json({ result: false, error: 'Aucun panier trouvé' });

    const alreadyIn = cart.trips.some(trip => trip.toString() === tripId);
    if (!alreadyIn) return res.json({ result: false, error: 'Voyage non trouvé dans le panier' });

    cart.trips = cart.trips.filter(trip => trip.toString() !== tripId);
    await cart.save();

    const updatedCart = await Cart.findOne({ isBook: false }).populate('trips');
    res.json({ result: true, cart: updatedCart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});
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