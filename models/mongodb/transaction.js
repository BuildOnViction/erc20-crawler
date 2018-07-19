'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Transaction = new Schema({
    hash: {
        type: String,
        index: true,
        unique: true
    },
    block: {
        type: Number,
        index: true
    },
    fromAccount: {
        type: String,
        index: true
    },
    toAccount: {
        type: String,
        index: true
    },
    tokenAmount: {
        type: Number
    },
    isProcess: {
        type: Boolean
    }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', Transaction)
