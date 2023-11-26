const express = require('express');
const tourRoute = require('./routes/TourRoute');
const userRoute = require('./routes/UserRoute')
const AppError = require('./Utils/appErrors.js');
const errorHandler = require('./controllers/errorController.js')

const app = express();
app.use(express.json());

//1) adding middleware which will be executed between requests and responses

console.log(process.env.NODE_ENV);
app.use((req, res, next) => {
  console.log('Hello worm middleware');
  req.requestTime = new Date().toISOString();
  next();
});

//3) Routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
// app.use('/api/v1/resturants', sslRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

//4) Start Server

module.exports = app;
