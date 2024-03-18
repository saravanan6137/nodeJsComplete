const ApiFeatures = require('./../Utils/apiFeatures.js');
const User = require('./../models/userModel');
const AppError = require('../Utils/appErrors');

exports.getAllUsers = async (req, res) => {
  try {
    // Execute the query
    const role = req.query.role; // Assuming req.query.role contains the role value
    let users;

    if (role) {
      users = await User.find({ role: role });
    } else {
      // If no role is provided, fetch all users
      users = await User.find();
    }
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
    console.log(obj[el])
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el]
      console.log(newObj[el])
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

exports.deleteMe = async (req, res, next) => {
  console.log('came')
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      err: err.message,
    });
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'Fail',
        message: 'No user found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: 'success',
      data: {
        user: user,
      },
    });
  } catch (err) { }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      success: 'success',
      data: null,
    });
  } catch (err) { }
};
