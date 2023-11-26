const ApiFeatures = require('./../Utils/apiFeatures.js');
const User = require('./../models/userModel');



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