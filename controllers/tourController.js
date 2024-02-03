const Tour = require('./../models/tourModel.js');
const ApiFeatures = require('./../Utils/apiFeatures.js');

//Middleware functions

exports.aliasTopFiveTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

//end

exports.getAllTours = async (req, res) => {
  try {
    // Execute the query
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

    //Send Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      err: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('reviews')
    if (!tour) {
      return res.status(404).json({
        status: 'Fail',
        message: 'No tour found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
    });
  }
};

exports.createTour = async (req, res) => {
  console.log('reached here');
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {}
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      success: 'success',
      data: null,
    });
  } catch (err) {}
};

exports.getTourStats = async (req, res) => {
  //
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numOfTours: { $sum: 1 },
          numOfratings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tours: stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {$month: '$startDates'},
          numOfTourStarts: {$sum: 1},
          tours: {$push: '$name'}
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {numOfTourStarts : -1}
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan: plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
