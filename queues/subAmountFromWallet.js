'use strict'
const db = require('../models/mongodb')
const consumer = {}

consumer.name = 'subAmountFromWallet'

consumer.task = async function(job, done) {
    let fromWallet = job.data.fromWallet
    let tokenAmount = job.data.tokenAmount
    console.info('subAmountFromWallet')
    let wallet = await db.Wallet.findOneAndUpdate({address: fromWallet}, {address: fromWallet}, { upsert: true, new: true })
    if (wallet.balance) {
        wallet.balance -= tokenAmount
    } else {
        wallet.balance = 0
    }
    if (wallet.transactionCount) {
        wallet.transactionCount += 1
    } else {
        wallet.transactionCount = 1
    }
    wallet.save()

    done();
};

module.exports = consumer