require('babel-register');
require('babel-polyfill');

var mnemonic = "MI FRASE SEMILLA";
var HDWalletProvider = require("truffle-hdwallet-provider")

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7546,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/339cdf2d95b34c2ebac1df8058373828");
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.10",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
