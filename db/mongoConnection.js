const mongoose = require('mongoose')

const connectionMongoDB = (url) => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = connectionMongoDB