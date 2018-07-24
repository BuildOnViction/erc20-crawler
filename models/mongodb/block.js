'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Block = new Schema({
    hash: {
        type: String,
        index: true,
        unique: true
    },
    blockNumber: {
        type: Number,
        index: true,
        unique: true
    },
    transactionCount: {
        type: Number,
        index: true
    },
    parentHash: {
        type: String
    },
    timestamp: {
        type: Number
    },
    isFinish: {
        type: Boolean
    }
}, { timestamps: false })

module.exports = mongoose.model('Block', Block)
