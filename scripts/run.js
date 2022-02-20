const { utils } = require("ethers");
const arkaniaNfts = require("../src/arkaniaNfts.json");
const auction = require("../src/auction.json");
const baseTokenURI = "ipfs://QmderjzRj2tqHayQa7Nx6rfcTBFutMYxEA7Ap4wjoxzUJa/";
const nftsContract = "ArkaniaNfts";
const auctionContract = "auction";
const auctionStartingBid = "0.04";
const nftForAuction = 0;

async function main() {
  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners();

  // Get contract that we want to deploy
  const nftsFactory = await hre.ethers.getContractFactory(nftsContract);

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
  txn = await contract.mintNFTs(3, { value: utils.parseEther("0.03") });
  await txn.wait();

  // Get all token IDs of the owner
  let tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens: ", tokens);

  // Get contract that we want to deploy
  const auctionFactory = await hre.ethers.getContractFactory("EnglishAuction");

  // Deploy contract with the correct constructor arguments
  const contract = await auctionFactory.deploy(
    nftContract.address,
    nftForAuction,
    utils.parseEther(auctionStartingBid)
  );

  // Wait for this transaction to be mined
  await auctionContract.deployed();

  // Get contract address
  console.log("Auction contract deployed to:", auctionContract.address);
}

const contract1 = new ethers.Contract(
  nftContract.address,
  arkaniaNfts.abi,
  owner
);

// Deploy contract with the correct constructor arguments
contract1.approve(auctionContract.address, nftForAuction);
console.log(`Auction contract approved to sell nft ${nftForAuction}`);

const contract2 = new ethers.Contract(
  auctionContract.address,
  auction.abi,
  owner
);

contract2.start();
// await auctionContract.get;
console.log(`Auction contract approved to sell nft ${nftForAuction}`);

// getOwner()
//     .then(ctx => hre.ethers.getContractFactory(contractName)
//         .then(contractFactory => ({...ctx, contractFactory})))
//     .then(ctx => ctx.contractFactory.deploy(baseTokenURI))
//     .then(ctx => ctx.contract.deployed())
//     .then(passThroughAwait(ctx => console.log("Contract deployed to:", ctx.contract.address)))
//     .then(ctx => ctx.contract.reserveNFTs()
//         .then(transaction => transaction.wait())
//         .then(() => console.log("1 NFT has been reserved")))
//     .then(ctx => ctx.contract.mintNFTs(3, {value: utils.parseEther('0.03')})
//         .then(transaction => transaction.wait()))
//     .then(owner => contract.tokensOfOwner(owner[0].address))
//
// function getOwner() {
//     return hre.ethers.getSigners()
//         .then(owner => ([owner]))
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
