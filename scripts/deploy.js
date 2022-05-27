const hre = require("hardhat");

async function main() {
  const AIFactory = await hre.ethers.getContractFactory("Ai");
  const AiContract = await AIFactory.deploy();

  await AiContract.deployed();

  console.log("Ai deployed to:", AiContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
