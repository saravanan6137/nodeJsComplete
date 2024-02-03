const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
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

//import data into DB
const importData = async () => {
    try {
        await Tour.create(tours)
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

