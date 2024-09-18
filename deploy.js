const hre = require("hardhat");

async function main() {
  const initialFunds = 1;  // Renamed variable to 'initialFunds'
  const FinanceManager = await hre.ethers.getContractFactory("FinanceManager"); // Updated contract name
  const financeManager = await FinanceManager.deploy(initialFunds); // Updated instance name
  await financeManager.deployed();

  console.log(`Contract with an initial balance of ${initialFunds} ETH deployed to ${financeManager.address}`); // Updated console message
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
