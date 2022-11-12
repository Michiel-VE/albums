const recordRouter = require('express').Router()
const recordmiddleware = require('../middleware/recordMiddleware')
const { authenticateUser } = require('../middleware/auth')

const {
    getAllRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord
} = require('../controllers/recordController')

recordRouter.route('/').get(getAllRecords)
recordRouter.route('/:id').get(getRecord)
recordRouter.route('/new').post(createRecord)
recordRouter.route('/:id').put(authenticateUser, updateRecord).delete(deleteRecord)

module.exports = recordRouter