'use strict'

const Web3 = require('web3')
const config = require('config')

 /*
    Mainnet provider
        - ws:   wss://mainnet.infura.io/ws
        - http: https://mainnet.infura.io
    Tomochain testnet
        - ws:   wss://testnet.tomochain.com/ws
        - http: https://testnet.tomochain.com

 */
const chain = new Web3(new Web3.providers.WebsocketProvider(config.get('provider.ws')))

module.exports = chain
