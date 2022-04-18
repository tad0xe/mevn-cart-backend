require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const  methodOverride = require('method-override');
const morgan = require('morgan');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 5000;



const app = express();
const router = express.Router();
const productsRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const ownerRoutes = require('./routes/owner');

const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const paymentRoutes = require("./routes/payment");
const searchRoutes = require("./routes/search");
const orderRoutes = require("./routes/order");

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", productsRoutes) 

app.use("/api", categoryRoutes) 
app.use("/api", ownerRoutes) 

app.use("/api", reviewRoutes);
app.use("/api", addressRoutes);
app.use("/api", paymentRoutes);
app.use("/api", searchRoutes);
app.use("/api", orderRoutes);
app.use("/", router);
//connect to mongodb

 mongoose
  .connect( process.env.CONNECTION_STRING)
  .then(() => {
    console.log(`Listening on ${ PORT }`);
  })
  .catch(err => console.log(err)); 
/*
mongoose.connect(process.env.DATABASE,  {
    useUnifiedTopology: true,
    useNewUrlParser: true,

    autoIndex: true, //make this also true
})
.then(() => {
    console.log('Connected to mongoDB');
})
.catch(err => {
 console.error('App starting error:', err.stack);
 process.exit(1);
});
*/
//const PORT = process.env.PORT || 5000;

app
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use('/', router);
//app.listen(port, function() {
 //console.log(`api running on port ${port}`);
//});
// ROUTES
router.post("/charge", function(req, res) {
  let totalPrice = Math.round(req.body.totalPrice * 100);

  var newCharge = {
    amount: totalPrice,
    currency: "usd",
    source: req.body.token_from_stripe, // obtained with Stripe.js
    description: req.body.engravingText,
    receipt_email: req.body.email,
    shipping: {
      name: req.body.name,
      address: {
        line1: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        postal_code: req.body.address.zip,
        country: "US"
      }
    }
  };

  // trigger charge
  stripe.charges.create(newCharge, function(err, charge) {
    // send response
    if (err) {
      console.error(err);
      res.json({ error: err, charge: false });
    } else {
      // send response with charge data
      res.json({ error: false, charge: charge });
    }
  });
});

// get data for charge by id
router.get("/charge/:id", function(req, res) {
  stripe.charges.retrieve(req.params.id, function(err, charge) {
    if (err) {
      res.json({ error: err, charge: false });
    } else {
      res.json({ error: false, charge: charge });
    }
  });
});
