const ApiFeatures = require('./../Utils/apiFeatures.js');
const User = require('./../models/userModel');
const AppError = require('../Utils/appErrors');

exports.getAllUsers = async (req, res) => {
  try {
    // Execute the query
    const users = await User.find();
    //Send Response
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      err: err.message,
    });
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    console.log( obj[el])
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el]
      console.log( newObj[el])
    }
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  console.log(req.body)
  //1) create error if user posts password data.
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates', 400));
  }

  //2) update user document
  try {
    const filteredBody = filterObj(req.body, 'name', 'email');
    console.log(filteredBody)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch {
    res.status(404).json({
      status: 'Failed',
      err: err.message,
    });
  }
};

exports.deleteMe = async(req, res, next) => {
  console.log('came')
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null
    });
   
  } catch(error) {
    res.status(404).json({
      status: 'Failed',
      err: err.message,
    });
  }
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

exports.createUser = (req, res) => {
  // console.log(req.body);
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};
