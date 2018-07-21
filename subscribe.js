'use strict'

const db = require('./models/mongodb')
const q = require('./queues')
const web3 = require('./models/blockchain/chain')


web3.eth.subscribe('logs', {address: config.get('tomoAddress')}, {}, function (error, sync) {
    console.log(error, sync)
})