import "./App.css";
import {
  Container,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Image,
} from "react-bootstrap";
import metamaskImg from "./metamask.png";
import { ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import auction from "./auction.json";
const auctionAddress = "0xB04CCCEd205a03ffc8b46041613a479d666D256C";

function App() {
  const [bid, setBid] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [endTime, setEndTime] = useState();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let contract = new ethers.Contract(auctionAddress, auction.abi, provider);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(auctionAddress, auction.abi, provider);
    getAuctionEndTime();
    getHighestBid();

    function getAuctionEndTime() {
      contract
        .endAt()
        .then((endTime) =>
          setEndTime(
            new Date(endTime.toNumber() * 1000).toLocaleString("en-US")
          )
        );
    }

    function getHighestBid() {
      contract.highestBid().then((bid) => setBid(utils.formatEther(bid)));
    }
  }, []);

  const connectAccount = getContractWithSigner;

  function getContractWithSigner() {
    return provider
      .send("eth_requestAccounts", [])
      .then(() => provider.getSigner())
      .then(
        (signer) => new ethers.Contract(auctionAddress, auction.abi, signer)
      );
  }

  async function handleBid() {
    getContractWithSigner().then((contract) => placeBid(contract));
  }

  function placeBid(contract) {
    contract
      .bid({ value: utils.parseEther(bidAmount) })
      .then((transaction) => provider.waitForTransaction(transaction.hash))
      .then(() => window.location.reload());
  }

  return (
    <Container>
      <Button onClick={() => connectAccount()} id="metamask">
        <Image src={metamaskImg} id="metamask-image" />
        connect
      </Button>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>
              <strong>Arkania Nfts</strong>
            </Card.Title>
            <Card.Text>
              One of the 10 first NFTs released from Arkania's private
              collection of squirrels
            </Card.Text>
            <Card.Text>
              Auction ends on <strong>{endTime}</strong>
            </Card.Text>
            <Card.Text>
              Current Bid: <strong>{bid} </strong>
              <i class="fa fa-ethereum"></i>
            </Card.Text>
            <InputGroup>
              <FormControl
                placeholder="Enter bid here..."
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <Button onClick={() => handleBid()}>
                <i class="fa fa-ethereum"></i> bid
              </Button>
            </InputGroup>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Image
          id="nft-image"
          src="https://opensea.mypinata.cloud/ipfs/QmPtWUs1H1e74hYZH1BeJcYnF51gjrEFLtMvCdrCyQFzu6/00.png"
        />
      </Col>
    </Container>
  );
}

export default App;
