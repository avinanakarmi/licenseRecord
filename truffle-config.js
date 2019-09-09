const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "capable stand guilt major twist elbow sad slab scout hundred embark that";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function () {
       return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/b224c9705fd641718101c7a989c617dd")},
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  },



  compilers: {
    solc: {
      version:"0.5.0"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
 },

  plugins: [ "truffle-security" ]

};

