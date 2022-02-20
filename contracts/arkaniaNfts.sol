//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ArkaniaNfts is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint public constant MAX_SUPPLY = 100;
    uint public constant PRICE = 0.00001 ether;
    uint public constant MAX_PER_MINT = 5;

    string public baseTokenURI;

    constructor(string memory baseURI) ERC721("arkania Nfts", "ARK") {
        setBaseURI(baseURI);
    }

    function reserveNFTs() public onlyOwner {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(1) < MAX_SUPPLY, "Not enough NFTs left to reserve");

        for (uint i = 0; i < 1; i++) {
            _mintSingleNFT();
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(uint _count) public payable {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left!");
        require(_count >0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
        // require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");

        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT();
        }
    }

    function _mintSingleNFT() private {
        uint newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        _tokenIds.increment();
    }

    function tokensOfOwner(address _owner) external view returns (uint[] memory) {

        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);

        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

}


























//pragma solidity ^0.8.4;
//
//import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Metadata.sol";
//
//contract ArkaniaNFT is ERC721, Ownable, ERC721MetaData, ERC721Enumerable {
//
//
//    uint public totalSupply;
//    uint public maxSupply;
//    bool public projectLaunched;
//    uint public mintPrice;
//    mapping(address => bool) public walletMinted;
//    using Counters for Counters.Counter;
//    Counters.Counter private _tokenIds;
//    mapping(string => uint8) hashes;
//
//    modifier isLaunched() {
//        require(projectLaunched, 'The project is not yet launched');
//    }
//
//    modifier hasNotMinted() {
//        require(walletMinted[msg.sender] == false, 'Can only mint 1 NFT per customer');
//    }
//
//    modifier isMintCost() {
//        require(msg.value == mintPrice, 'Must send amount equal to mint price');
//    }
//
//    modifier notSoldOut() {
//        require(totalSupply < maxSupply, 'project is sold out');
//    }
//
//    constructor(uint _maxSupply) payable ERC721('Arkania', 'ARK') {
//        maxSupply = _maxSupply;
//        mintPrice = _mintPrice;
//        _setBaseURI("ipfs://");
//    }
//
//    function launchProject() onlyOwner {
//        require(projectLaunched == false, "Project is already launched");
//        projectLaunched = true;
//    }
//
//    function setMaxSupply(uint _maxSupply) onlyOwner {
//        maxSupply = _maxSupply;
//    }
//
//    function mint() isLaunched hasNotMinted isMintCost notSoldOut {
//        walletMinted[msg.sender] = true;
//        totalSupply++;
//        _tokenIds.increment();
//        uint tokenId = _tokenIds.current();
//        _safeMint(msg.sender, tokenId);
//        _setTokenURI(tokenId, metadata);
//    }























    //    using SafeMath for uint256;
    //    using Counters for Counters.Counter;
    //
    //    Counters.Counter private _tokenIds;
    //
    //    uint public constant MAX_SUPPLY = 100;
    //    uint public constant MINT_PRICE = 0.01 ether;
    //    uint public constant MAX_PER_MINT = 5;
    //
    //    string public baseTokenURI;
    //
    //    constructor(string memory baseURI) ERC721("Arkania", "ARK") {
    //        setBaseURI(baseURI);
    //    }
    //
    //    function reserveNFTs() public onlyOwner {
    //        uint totalMinted = _tokenIds.current();
    //
    //        require(totalMinted.add(10) < MAX_SUPPLY, "Not enough NFTs left to reserve");
    //
    //        for (uint i = 0; i < 10; i++) {
    //            _mintSingleNFT();
    //        }
    //    }
    //
    //    function _baseURI() internal view virtual override returns (string memory) {
    //        return baseTokenURI;
    //    }
    //
    //    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
    //        baseTokenURI = _baseTokenURI;
    //    }
    //
    //    function mintNFTs(uint _count) public payable {
    //        uint totalMinted = _tokenIds.current();
    //
    //        require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left!");
    //        require(_count >0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
    //        require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");
    //
    //        for (uint i = 0; i < _count; i++) {
    //            _mintSingleNFT();
    //        }
    //    }
    //
    //    function _mintSingleNFT() private {
    //        uint newTokenID = _tokenIds.current();
    //        _safeMint(msg.sender, newTokenID);
    //        _tokenIds.increment();
    //    }
    //
    //    function tokensOfOwner(address _owner) external view returns (uint[] memory) {
    //
    //        uint tokenCount = balanceOf(_owner);
    //        uint[] memory tokensId = new uint256[](tokenCount);
    //
    //        for (uint i = 0; i < tokenCount; i++) {
    //            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
    //        }
    //        return tokensId;
    //    }
    //
    //    function withdraw() public payable onlyOwner {
    //        uint balance = address(this).balance;
    //        require(balance > 0, "No ether left to withdraw");
    //
    //        (bool success, ) = (msg.sender).call{value: balance}("");
    //        require(success, "Transfer failed.");
    //    }

//}