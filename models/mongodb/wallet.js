'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Wallet = new Schema({
    address: {
        type: String,
        index: true,
        unique: true
    },
    balance: {
        type: Number,
        index: true
    },
    transactionCount: {
        type: Number,
        index: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Wallet', Wallet)
