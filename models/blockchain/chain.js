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

const provider = new Web3.providers.WebsocketProvider(config.get('provider.ws'))
provider.connection.onerror(function (e) {
    console.log('Provider error: ', e)
    process.exit(1)
})
provider.connection.onclose(function (e) {
    console.log('End provider: ', e)
    proccess.exit(1)
})
const chain = new Web3(provider)

module.exports = chain
