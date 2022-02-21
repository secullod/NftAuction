const { utils } = require("ethers");
const baseTokenURI = "ipfs://QmderjzRj2tqHayQa7Nx6rfcTBFutMYxEA7Ap4wjoxzUJa/";
const nftsContractName = "ArkaniaNfts";
const auctionContractName = "EnglishAuction";
const auctionStartingBid = "0.04";
const nftForAuction = 0;

async function main() {
  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners();

  // Get contract that we want to deploy
  const nftsFactory = await hre.ethers.getContractFactory(nftsContractName);

  // Deploy contract with the correct constructor arguments
  const nftContract = await nftsFactory.deploy(baseTokenURI);

  // Wait for this transaction to be mined
  await nftContract.deployed();

  // Get contract address
  console.log("Contract deployed to:", nftContract.address);

  // Reserve NFTs
  let txn = await nftContract.reserveNFTs();
  await txn.wait();
  console.log("1 NFT has been reserved");

  // Mint 3 NFTs by sending 0.03 ether
  txn = await nftContract.mintNFTs(3, { value: utils.parseEther("0.03") });
  await txn.wait();

  // Get all token IDs of the owner
  let tokens = await nftContract.tokensOfOwner(owner.address);
  console.log("Owner has tokens: ", tokens);

  // Get contract that we want to deploy
  const auctionFactory = await hre.ethers.getContractFactory(
    auctionContractName
  );

  // Deploy contract with the correct constructor arguments
  const auctionContract = await auctionFactory.deploy(
    nftContract.address,
    nftForAuction,
    utils.parseEther(auctionStartingBid)
  );

  // Wait for this transaction to be mined
  await auctionContract.deployed();

  // Get contract address
  console.log("Auction contract deployed to:", auctionContract.address);

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
  console.log(`Auction contract to sell nft ${nftForAuction} is started`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
