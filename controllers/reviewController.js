const ApiFeatures = require('./../Utils/apiFeatures.js');
const Review = require('./../models/reviewModel.js');
const AppError = require('../Utils/appErrors');

exports.getAllReviews = async (req, res) => {
    try {
        // Execute the query
        const reviews = await Review.find();
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
    console.log(req.body);
    try {
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

