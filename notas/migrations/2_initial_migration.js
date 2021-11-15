const notas = artifacts.require("notas");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(notas);
};