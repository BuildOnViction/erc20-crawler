'use strict'

const db = require('./models/mongodb')
const q = require('./queues')

const tomocoin = require('./models/blockchain/tomocoin')

tomocoin.getPastEvents('Transfer', {
    filter: {},
    fromBlock: 0,
}, function (error, events) {
    if (!error){
        for (let i=0; i < events.length; i++) {
            let event = events[i]
            if (event.event === 'Transfer') {
                let blockNumber = event.blockNumber
                let transactionHash = event.transactionHash
                let fromWallet = event.returnValues.from
                let toWallet = event.returnValues.to
                let tokenAmount = parseFloat(event.returnValues.value) / 10 ** 18

                console.log(blockNumber, transactionHash, fromWallet, toWallet, tokenAmount)
                console.log('--------------------')


                let tran = new db.Transaction({
                    hash: transactionHash,
                    block: blockNumber,
                    fromWallet: fromWallet,
                    toWallet: toWallet,
                    tokenAmount: tokenAmount,
                    isProcess: false
                })
                tran.save()

                q.create('newTransaction', {fromWallet: fromWallet, toWallet: toWallet, tokenAmount: tokenAmount})
                    .priority('high').removeOnComplete(true).save()

            }
        }
    }
})
