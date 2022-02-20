require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/6a9e5778455b44bca3b60f3614560463",
      accounts: [`0x${process.env.ARKANIA_PRIVATE_KEY}`],
    },
  },
};
