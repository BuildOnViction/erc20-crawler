'use strict'
const db = require('../models/mongodb')
const consumer = {}

consumer.name = 'addAmountToWallet'

consumer.task = async function(job, done) {
    let fromWallet = job.data.fromWallet
    let toWallet = job.data.toWallet
    let tokenAmount = job.data.tokenAmount
    let transactionHash = job.data.transactionHash
    console.log('   - add ', tokenAmount, 'TOMO to wallet: ', toWallet)
    let wallet = await db.Wallet.findOneAndUpdate({address: toWallet}, {address: toWallet}, { upsert: true, new: true })
    if (wallet.balance) {
        wallet.balance += tokenAmount
    } else {
        wallet.balance = tokenAmount
    }
    if (wallet.transactionCount) {
        wallet.transactionCount += 1
    } else {
        wallet.transactionCount = 1
    }

    wallet.save()

    await db.Transaction.findOneAndUpdate(
        {hash: transactionHash, fromAccount: fromWallet, toAccount: toWallet},
        {isAddToken: true}, { upsert: true, new: true }
    )

    done();

};

module.exports = consumer