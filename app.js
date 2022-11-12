require('dotenv').config()
const express = require('express')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const recordRouter = require('./routes/recordRoutes')
const loginRouter = require('./routes/authRoutes')
const asyncWrapper = require('./middleware/asyncErrors')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const { PORT, MONGO_CONNECTION_URL, SESSION_SECRET } = process.env
const connectMongoDB = require('./db/mongoConnection')

app.use(express.json())

app.use(express.static('./public'));
app.use(session({
  secret: SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({
    uri: MONGO_CONNECTION_URL,
    collection: 'passport-sessions',
  }),
}));

app.use(passport.authenticate('session'));


app.use('/records', recordRouter)
app.use('/', loginRouter)

app.use('/', express.static('public'))

app.use(errorHandler)

app.listen(PORT, asyncWrapper(async () => {
  await connectMongoDB(MONGO_CONNECTION_URL)

  console.log(`server listening on port ${PORT}...`)
}))

module.exports = app;