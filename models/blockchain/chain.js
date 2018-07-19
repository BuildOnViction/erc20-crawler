'use strict'

const Web3 = require('web3')

// const chain = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/"));
// const chain = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws"));
const chain = new Web3(new Web3.providers.WebsocketProvider("wss://testnet.tomochain.com/ws"));
// const chain = new Web3(Web3.givenProvider || 'wss://testnet.tomochain.com/ws')
// const chain = new WebsocketProvider('wss://mainnet.infura.io/ws')

module.exports = chain
