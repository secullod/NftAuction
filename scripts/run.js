const { utils } = require("ethers");

const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers");

const baseTokenURI = "ipfs://QmderjzRj2tqHayQa7Nx6rfcTBFutMYxEA7Ap4wjoxzUJa/";
const contractName = "ArkaniaNfts";

async function main() {
  const baseTokenURI = "ipfs://QmderjzRj2tqHayQa7Nx6rfcTBFutMYxEA7Ap4wjoxzUJa/";

  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners();

  // Get contract that we want to deploy
  const contractFactory = await hre.ethers.getContractFactory(contractName);

  // Deploy contract with the correct constructor arguments
  const contract = await contractFactory.deploy(baseTokenURI);

  // Wait for this transaction to be mined
  await contract.deployed();

  // Get contract address
  console.log("Contract deployed to:", contract.address);

  // Reserve NFTs
  let txn = await contract.reserveNFTs();
  await txn.wait();
  console.log("1 NFT has been reserved");

  // Mint 3 NFTs by sending 0.03 ether
  txn = await contract.mintNFTs(3, { value: utils.parseEther("0.03") });
  await txn.wait();

  // Get all token IDs of the owner
  let tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens: ", tokens);
}

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
