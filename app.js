const express = require('express');
const tourRoute = require('./routes/TourRoute');
const userRoute = require('./routes/UserRoute')
const reviewRoute = require('./routes/ReviewRoute');
const AppError = require('./Utils/appErrors.js');
const errorHandler = require('./controllers/errorController.js')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')

const app = express();

//1) (GLOBAL) adding middleware which will be executed between requests and responses
//set security headers

app.use(helmet());

//Limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body

app.use(express.json());

//Data sanitization against NNOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent query pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}))

//Test middleware
app.use((req, res, next) => {
  console.log('Hello worm middleware');
  req.requestTime = new Date().toISOString();
  next();
});


//2) Routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

//4) Start Server

module.exports = app;
