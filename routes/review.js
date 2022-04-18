const router = require("express").Router();
const Review = require("../models/review");
const Product = require("../models/product");
const verifyToken = require("../middelwares/verify-token");


// POST review
router.post(
  "/reviews/:productID",
  [verifyToken],
  async (req, res) => {
      console.log(res)
    try {
      const review = new Review();
      review.headline = req.body.headline;
      review.body = req.body.body;
      review.rating = req.body.rating;
     
      review.user = req.decoded._id;
      review.productID = req.params.productID;

      await Product.update({
        $push: {
          reviews: review._id
        }
      });

      const savedReview = await review.save();

      if (savedReview) {
        res.json({
          success: true,
          message: "Succesfully Added Review"
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// GET single review
router.get("/reviews/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
        productID: req.params.productID
      })
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: productReviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;