const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory('Ai');
    const daoContract = await contractFactory.deploy();
    await daoContract.deployed();
    console.log("Contract deployed to:", daoContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();