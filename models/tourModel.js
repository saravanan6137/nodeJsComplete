const mongoose = require('mongoose');

//Describing the schema or model and adding validations.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A Tour must have a duration'],
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a maximum group size'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: 'Discount price ({VALUE}) should be lower than regular price',
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a Summary'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  startDates: [Date],
  stratLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  //refering in mongo db
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
});

tourSchema.set('toObject', { virtuals: true });
tourSchema.set('toJSON', { virtuals: true });

//Virtual property which will not be saved in the DB but can be sent to response as quick convertion or values.
// tourSchema.virtual('durationWeeks', function() {
//     return this.duration / 7
// })

//Virtual populate.
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

// //DOCUMENT MIDDLEWARE: runs before .Save() or .Create()

// tourSchema.pre('save', function(next) {
//     // console.log(this)
//     next()
// })

// //DOCUMENT MIDDLEWARE: runs after .Save() or .Create()
// tourSchema.post('save', function(doc, next) {
//     // console.log(doc)
//     next()
// })

// Embedded User in Tours
// tourSchema.pre('save', async function (next) {
//   console.log('reached here', this.guides)
//   const guidePromises = this.guides.map(async id => await User.findById(id))
//   console.log('reached here 1', guidePromises)
//   this.guides = await Promise.all(guidePromises)
//   next()
// })

//QUERY MIDDLEWARE

tourSchema.index({price: 1, ratingsAverage: -1})

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`this query took ${Date.now() - this.start}`);
  next();
});

//Query middleware to refer USER table and populate the Users inside the Tours.
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: '-__v -passwordChangedAt'
  });
  next();
});

//AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
