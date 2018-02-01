const ETHMap = artifacts.require("ETHMap.sol");

module.exports = function(deployer, network, accounts) {
  console.log("Deploying to: ", network, accounts)
  deployer.deploy(ETHMap)
}