'use strict'
const db = require('../models/mongodb')
const consumer = {}

consumer.name = 'newTransaction'
consumer.task = async function(job, done) {
    let fromWallet = job.data.fromWallet
    let toWallet = job.data.toWallet
    let tokenAmount = job.data.tokenAmount

    await db.Wallet.findOneAndUpdate({address: fromWallet}, {address: fromWallet}, { upsert: true, new: true })
    await db.Wallet.findOneAndUpdate({address: toWallet}, {address: toWallet}, { upsert: true, new: true })

    const q = require('./index')
    q.create('addAmountToWallet', {toWallet: toWallet, tokenAmount: tokenAmount})
        .priority('high').removeOnComplete(true).save()

    q.create('subAmountFromWallet', {fromWallet: fromWallet, tokenAmount: tokenAmount})
        .priority('high').removeOnComplete(true).save()

    done()
};

module.exports = consumer