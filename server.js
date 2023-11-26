const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(con => {
    console.log('Connected successfully');
});

// testTour.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.log('error occured')
// })

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
