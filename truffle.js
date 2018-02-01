var ganache = require('ganache-cli')
var HDWalletProvider = require('truffle-hdwallet-provider')
var dotenv = require('dotenv').config()

var infuraKey = 'UIWcVZuPtuXHpAFglFyd'
var mnemonic = dotenv.parsed.PASSPHRASE

module.exports = {
  contracts_build_directory: './static/contracts',
  test: {
    provider: ganache.provider(), // in-memory TestRPC provider
    network_id: '*' // Match any network id
  },
  networks: {
    live: {
      provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/" + infuraKey, 0),
      network_id: 1,
      gasPrice: '22000000000',
      gas: '2000000'
    },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/' + infuraKey, 0),
      network_id: 3,
      gas: 4700000
    }
  }
}
