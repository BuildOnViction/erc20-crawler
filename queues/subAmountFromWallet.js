'use strict'
const db = require('../models/mongodb')
const consumer = {}

consumer.name = 'subAmountFromWallet'

consumer.task = async function(job, done) {
    let fromWallet = job.data.fromWallet
    let toWallet = job.data.toWallet
    let tokenAmount = job.data.tokenAmount
    let transactionHash = job.data.transactionHash
    console.log('   - sub ', tokenAmount, 'TOMO from wallet: ', fromWallet)
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

    await db.Transaction.findOneAndUpdate(
        {hash: transactionHash, fromAccount: fromWallet, toAccount: toWallet},
        {isSubToken: true}, { upsert: true, new: true }
    )

    done();
};

module.exports = consumer