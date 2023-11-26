const mongoose = require('mongoose');

const resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Resturant must have a name'],
        unique:true,
        trim: true
    },
    distance: {
        type: Number,
        required: [true, 'A Resturant must have a distance'],
    },
    difficulty: {
        type: String,
        required: [true, 'A Tour must have a difficulty']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a maximum group size']
    },
    ratingsAverage: {
        type: Number,
        default:4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
        type:String,
        trim: true,
        required:[true, 'A Tour must have a Summary']
    },
    description: {
        type:String,
        trim:true,
        required:[true, 'A Tour must have a description']
    },
    imageCover: {
        type:String,
        required:[true, 'A Tour must have a cover image']
    },
    images:[String],
    createdAt: {
        type:Date,
        default: Date.now()
    },
    startDates: [Date]

})

const Resturant = mongoose.model('Resturant', resturantSchema)

module.exports = Resturant