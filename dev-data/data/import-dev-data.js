const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')
const fs = require('fs')
dotenv.config({ path: './config.env' });

const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(con => {
    console.log('Connected successfully');
});

//READ JSON FILES

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));

//import data into DB
const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users)
        await Review.create(reviews)
        console.log('Data successfully loaded');
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

// Delete data from the DB

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data successfully Deleted');
    } catch(err) {
        console.log(err)
    }
    process.exit()
}

if (process.argv[2] == "--import") {
    importData()
} else if (process.argv[2] == "--delete") {
    deleteData()
}

