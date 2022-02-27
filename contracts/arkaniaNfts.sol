//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract ArkaniaNfts is ERC721Enumerable, ERC2981, Ownable  {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint public constant MAX_SUPPLY = 100;
    uint public constant PRICE = .001 ether;

    string public contractURI;
    string public baseTokenURI;
    bool public projectLaunched;
    address payable public payments;
    mapping(address => bool) public walletMinted;


    constructor(string memory baseURI, uint96 _royaltyFeesInBips, string memory _contractURI, address payable _payments) ERC721("arkania Nfts", "ARK") {
        setBaseURI(baseURI);
        contractURI = _contractURI;
        setRoyaltyInfo(msg.sender, _royaltyFeesInBips);
        payments = _payments;
    }

    modifier isLaunched() {
        require(projectLaunched, "The project is not yet launched");
        _;
    }

   modifier hasNotMinted() {
        require(walletMinted[msg.sender] == false, "Can only mint 1 NFT per customer");
        _;
   }

   modifier isMintCost() {
        require(msg.value == PRICE, "Must send amount equal to mint price");
        _;
   }

   modifier notSoldOut() {
        require(_tokenIds.current() < MAX_SUPPLY, "project is sold out");
        _;
   }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mint() public payable isLaunched hasNotMinted isMintCost notSoldOut {
        walletMinted[msg.sender] = true;
        _safeMint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }    

    function launchProject() public onlyOwner {
        require(projectLaunched == false, "Project is already launched");
        projectLaunched = true;
    }

    function withdraw() public payable {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = payable(payments).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function setContractURI(string calldata _contractURI) public onlyOwner {
        contractURI = _contractURI;
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC2981, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}