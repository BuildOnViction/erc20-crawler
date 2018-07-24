'use strict'

const config = require('config')
const db = require('./models/mongodb')
const q = require('./queues')
const web3 = require('./models/blockchain/chain')

let sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

async function crawlProcess() {
    for (let i = config.get('fromBlock'); i < config.get('toBlock'); i++) {

        /*
         TODO: Remove this check.
         It is only for Tomocoin. We break some first block because there is no transaction about Tomocoin event transfer
        */
        if (config.get('tomoAddress') === '0x8b353021189375591723e7384262f45709a3c3dc'){
            if (i !== 5168958 && i !== 5169011 && i !== 5169173 && i < 5175169) {
                continue
            }
        }
        // if (i % 10 === 0) {
        //     console.log('Sleep 120 seconds')
        //     await sleep(120000)
        // }

        let block = await web3.eth.getBlock(i);
        let b = await db.Block.findOne({blockNumber: i})
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

        console.log("Process block number: " + i);
        let listTransactions = await block.transactions
        if (listTransactions != null && block != null) {
            await q.create('newTransaction', {transactions: listTransactions.toString(), blockNumber: block.number})
                .attempts(5).backoff({delay: 10000})
                .priority('low').removeOnComplete(true).save()
        }
    }
}

crawlProcess()
