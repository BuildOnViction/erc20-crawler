'use strict'

const db = require('./models/mongodb')
const request = require('request')
const q = require('./queues')

const mainUrl = 'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x8b353021189375591723e7384262f45709a3c3dc&offset=600&sort=asc&page='

async function processCrawl() {
    let page = 1
    while (true) {
        let url = mainUrl + page.toString()
        console.log('Crawl url: ', url)
        let b = await crawlUrl(url)
        let body = JSON.parse(b)

        if (body.status === '0') {
            console.log('Finish crawl')
            break
        }

        for (let i=0; i < body.result.length; i++) {
            let transaction = body.result[i]

            let tran = await new db.Transaction({
                hash: transaction.hash,
                block: transaction.blockNumber,
                fromAccount: transaction.from,
                toAccount: transaction.to,
                tokenAmount: parseFloat(transaction.value) / 10 ** 18,
                isProcess: true
            })
            tran.save()

            await db.Wallet.findOneAndUpdate({address: transaction.from}, {address: transaction.from}, {upsert: true, new: true})
            await db.Wallet.findOneAndUpdate({address: transaction.to}, {address: transaction.to}, {upsert: true, new: true})
            q.create('subAmountFromWallet', {fromWallet: transaction.from, tokenAmount: parseFloat(transaction.value) / 10 ** 18})
                .priority('high').removeOnComplete(true).save()

            q.create('addAmountToWallet', {toWallet: transaction.to, tokenAmount: parseFloat(transaction.value) / 10 ** 18})
                .priority('high').removeOnComplete(true).save()
        }

        page++
    }
}

function crawlUrl(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}


processCrawl()
