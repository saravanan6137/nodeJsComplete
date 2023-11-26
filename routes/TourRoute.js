const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopFiveTours,
  getTourStats,
  getMonthlyPlan
} = require('./../controllers/tourController');
const authController = require('./../controllers/authController')

const router = express.Router();

// router.param('id', checkId)
router.route('/getTopFiveTours').get(aliasTopFiveTours, getAllTours)
router.route('/stats').get(getTourStats)
router.route('/monthlyPlan/:year').get(getMonthlyPlan)
router.route('/').get(authController.protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
