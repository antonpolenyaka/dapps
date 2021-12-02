require('babel-register');
require('babel-polyfill');

var mnemonic = "frase semilla";
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    // Ganche
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    
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
