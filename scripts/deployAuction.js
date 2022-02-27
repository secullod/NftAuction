const { utils } = require("ethers");
const baseTokenURI = "ipfs://QmderjzRj2tqHayQa7Nx6rfcTBFutMYxEA7Ap4wjoxzUJa/";
const contractURI = "ipfs://QmWaxK15PU226iB3D9mFxmj9pPGPByutzb9gTX1PUwERZX";
const nftsContractName = "ArkaniaNfts";
const auctionContractName = "ArkaniaAuction";
const auctionStartingBid = "0.04";
const splitterContractName = "ArkaniaSplitter";
const nftForAuction = 0;
paymentReceivers = [
  "0x9e9709c7218619bbf98a8b54aa8f40cfe34f9ef8",
  "0x8e4faee039a94e4da2d3276118a7cc6ea706b27c",
  "0x7e38064ad43676b9030224de0de6dc293e058f6b",
];
paymentSplit = [20, 40, 40];
royaltyFeeInBips = 250;

async function main() {
  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners();

  // Get contract that we want to deploy
  const splitterFactory = await hre.ethers.getContractFactory(
    splitterContractName
  );

  // Deploy contract with the correct constructor arguments
  console.log(`Deploying the ${splitterContractName} contract`);
  const splitterContract = await splitterFactory.deploy(
    paymentReceivers,
    paymentSplit
  );

  // Wait for this transaction to be mined
  await splitterContract.deployed();
  console.log(
    `${splitterContractName} contract deployed to: ${splitterContract.address}`
  );

  // Get contract that we want to deploy
  const nftsFactory = await hre.ethers.getContractFactory(nftsContractName);

  // Deploy contract with the correct constructor arguments
  console.log(`Deploying the ${nftsContractName} contract`);
  const nftContract = await nftsFactory.deploy(
    baseTokenURI,
    royaltyFeeInBips,
    contractURI,
    splitterContract.address
  );

  // Wait for this transaction to be mined
  await nftContract.deployed();

  // Get contract address
  console.log(
    `${nftsContractName} contract deployed to: ${nftContract.address}`
  );

  txn = await nftContract.launchProject();
  await txn.wait();
  console.log("Project Launched");

  // Mint 1 NFT by sending 0.001 ether
  txn = await nftContract.mint({ value: utils.parseEther("0.001") });
  await txn.wait();
  console.log("1 NFT has been minted");

  // Get contract that we want to deploy
  const auctionFactory = await hre.ethers.getContractFactory(
    auctionContractName
  );

  // Deploy contract with the correct constructor arguments
  console.log(`Deploying the ${auctionContractName} contract`);
  const auctionContract = await auctionFactory.deploy(
    nftContract.address,
    nftForAuction,
    utils.parseEther(auctionStartingBid)
  );

  // Wait for this transaction to be mined
  await auctionContract.deployed();

  // Get contract address
  console.log(
    `${auctionContractName} contract deployed to: ${auctionContract.address}`
  );

  // Deploy contract with the correct constructor arguments
  const approval = await nftContract.approve(
    auctionContract.address,
    nftForAuction
  );
  await approval.wait();

  console.log(`Auction contract approved to sell nft ${nftForAuction}`);

  const start = await auctionContract.start();
  await start.wait();

  // await auctionContract.get;
  console.log(`Auction contract to sell nft ${nftForAuction} started`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
