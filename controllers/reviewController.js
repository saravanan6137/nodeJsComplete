const ApiFeatures = require('./../Utils/apiFeatures.js');
const Review = require('./../models/reviewModel.js');
const AppError = require('../Utils/appErrors');

exports.getAllReviews = async (req, res) => {
    try {
        let filter= {};
        if(req.params.tourId) filter = {tour: req.params.tourId}
        // Execute the query
        const reviews = await Review.find(filter);
        //Send Response
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews: reviews,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Failed',
            err: err.message,
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        //Allow nested routes
        if(!req.body.tour) req.body.tour = req.params.tourId;
        if(!req.body.user) req.body.user = req.user.id;
        const review = await Review.create(req.body);
        res.status(200).json({
            success: true,
            data: {
                review: review
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err,
        });
    }
};

