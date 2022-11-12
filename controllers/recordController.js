const { StatusCodes } = require('http-status-codes')
const Record = require("../models/record")

const asyncWrapper = require('../middleware/asyncErrors')
const { notFoundError } = require('../customErrors/notFound')
const { badRequestError } = require('../customErrors/badRequest')

const sortingFilter = (queryObject, filter) => {
    const operationMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    }

    const options = ['releaseYear']

    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = filter.replace(regEx, (match) => `-${operationMap[match]}-`)

    filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-')
        if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) }
        }
    })

    return queryObject
}

const getAllRecords = asyncWrapper(async (req, res) => {
    const {
        sort, filter, fields, artistName, title,
    } = req.query;

    let queryObject = {}
    let result

    if (artistName) {
        queryObject.artistName = { $regex: artistName, $options: 'i' }
    }
    if (title) {
        console.log(queryObject.label);
        queryObject.title = { $regex: title, $options: 'i' }
    }
    if (filter) {
        queryObject = sortingFilter(queryObject, filter)
    }
    result = Record.find(queryObject)

    if (sort) {
        const params = sort.split(',').join(' ')
        result = result.sort(params)
    } else {
        result = result.sort('artistName')
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    } else {
        result = result.select();
    }


    const records = await result;

    res.status(StatusCodes.OK).json({ records })
})

const getRecord = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const record = await Record.findById(id);

    if (!record) {
        return next(notFoundError(id))
    }

    res.status(StatusCodes.OK).json({ success: true, data: record })
})

const createRecord = asyncWrapper(async (req, res, next) => {
    const { artistName, title, trackCount, releaseYear } = req.body
    if (!artistName || !title || !trackCount || !releaseYear) {
        return next(badRequestError())
    }
    const records = await Record.create(req.body)

    res.status(StatusCodes.CREATED).json({ success: true, data: records })
})

const updateRecord = asyncWrapper(async (req, res, next) => {
    const { id } = req.params

    const record = await Record.findById({ _id: id })

    if (!record) {
        return next(notFoundError(id))
    }

    await Record.findByIdAndUpdate(id, req.body)

    res.status(StatusCodes.OK).json({ success: true })
})

const deleteRecord = asyncWrapper(async (req, res) => {
    const { id } = req.params

    const deleteRecordDB = await Record.findById(id)

    if (!deleteRecordDB) {
        return next(badRequestError())
    }

    await Record.deleteOne({ _id: id })

    return res.status(StatusCodes.OK).json({ success: true })
})

module.exports = { getAllRecords, getRecord, createRecord, updateRecord, deleteRecord }