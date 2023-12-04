const { promisify } = require('util');
const crypto = require('crypto');
const AppError = require('../Utils/appErrors');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../Utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions)

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    jwtToken: token,
    data: {
      user
    },
  });
  
}

exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({
      mesage: 'Failed',
      error: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //1) Check if email and password are exists.
    if (!email || !password) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }
    //2) Check if user exists and password is correct
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: 'Incorrect email or password',
      });
    }
    //3) If everything ok, send token to client.
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(401).json({
      error: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  //1. getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in, please login to get access', 401)
    );
  }
  //2. verify token

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3. check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }
    //4. check if user changed passwrod after the jwt was issued.

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently change password, please login again', 401)
      );
    }
    req.user = currentUser;
  } catch (err) {
    return next(new AppError(err.message, 401));
  }
  //Grant access to protected route.

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to do this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1) get user based on posted email
  console.log('came');
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user'), 404);
  }

  // 2) generate random token
  const resetToken = user.createPassowrdResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and please confirm to: ${resetUrl}. \nIf you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 mins',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending email, please try again later',
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  //1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token is not expired and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) update ChangedPasswordAt property for the user //in middleware

  //4) Log the user in, send JWT.
  createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
  //1) Get user from collection
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(new AppError('User does not exist', 400));
    }
    //2) Check if posted current password is correct
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(new AppError('Incorrect password', 400));
    }

    //3)if so, update the password.
    user.password = newPassword;
    user.confirmPassword = confirmPassword;

    await user.save();

    //4) Log user in, send jwt
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      mesage: 'Failed',
      error: err,
    });
  }
};
