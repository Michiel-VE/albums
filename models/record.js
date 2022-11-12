const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    artistName: {
        type: String,
        required: [true, 'Please add a artist name!']
    },
    title: {
        type: String,
        required: [true, 'Please add a album name!']

    },
    trackCount: {
        type: Number,
        min: [1, 'The album has to have more then one track']
    },
    releaseYear: {
        type: Number,
        min: [1950, 'Year is to long ago'],
        max: [2022, 'Year is in the future']
    }
})

module.exports = mongoose.model('Records', recordSchema, 'albums')