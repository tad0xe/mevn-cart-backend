const router = require("express").Router();
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECREY_KEY);
const verifyToken = require("../middelwares/verify-token");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");

const SHIPMENT = {
  normal: {
    price: 13.98,
    days: 7
  },
  fast: {
    price: 49.98,
    days: 3
  }
};

function shipmentPrice(shipmentOption) {
  let estimated = moment()
    .add(shipmentOption.days, "d")
    .format("dddd MMMM Do");

  return { estimated, price: shipmentOption.price };
}

router.post("/shipment", (req, res) => {
  let shipment;
  if (req.body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal);
  } else {
    shipment = shipmentPrice(SHIPMENT.fast);
  }

  res.json({ success: true, shipment: shipment });
});
/*
router.post("/payment",  (req, res) => {
  
  let totalPrice = Math.round(req.body.totalPrice * 100);
  return stripe.charges.create({
    amount: totalPrice,
    currency: "usd",
    source: req.body.token_from_stripe,
  })
 
    .then(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});
*/

router.post("/charge", function(req, res) {
  var newCharge = {
    amount: totalPrice,
    currency: "usd",
    source: req.body.token_from_stripe, // obtained with Stripe.js
    cart: this.getCart,
    estimatedDelivery: this.getEstimatedDelivery
  };

  // trigger charge
  stripe.charges.create(newCharge, function(err, charge) {
    // send response
    if (err) {
      console.error(err);
      res.json({ error: err, charge: false });
    } else {
      console.log(correct);
      res.json({ error: false, charge: charge });
      // format for email
     
      // compose email
     
      // send response with charge data
     
    }
  });
});

module.exports = router;
