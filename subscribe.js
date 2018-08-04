'use strict'

const config = require('config')
const db = require('./models/mongodb')
const q = require('./queues')
const web3 = require('./models/blockchain/chain')

let sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

async function crawlProcess() {
    while (true) {

        let block = await web3.eth.getBlock('latest');
        let b = await db.Block.findOne({blockNumber: block.number})
        if (b && b.isFinish) {
            continue
        }
        await db.Block.findOneAndUpdate({blockNumber: block.number}, {
            hash: block.hash,
            blockNumber: block.number,
            transactionCount: block.transactions.length,
            parentHash: block.parentHash,
            timestamp: block.timestamp,
        }, { upsert: true, new: true })

        console.log("Process block number: " + block.number);
        let listTransactions = await block.transactions
        if (listTransactions != null && block != null) {
            await q.create('newTransaction', {transactions: listTransactions.toString(), blockNumber: block.number})
                .attempts(5).backoff({delay: 10000})
                .priority('low').removeOnComplete(true).save()
        }
        await new Promise(done => setTimeout(done, 5000));
    }
}

crawlProcess()
