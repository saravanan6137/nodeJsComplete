const express = require('express');

const { getAllReviews, createReview } = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const router = express.Router({mergeParams: true});
//POST /tour/12345/reviews
//POST /reviews

router.use(authController.protect)

router.route('/').get(getAllReviews).post(authController.restrictTo('user'), createReview);

module.exports = router;