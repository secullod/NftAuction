import "./App.css";
import delay from "delay";
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

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(auctionAddress, auction.abi, signer);
    contract
      .endAt()
      .then((end) =>
        setEndTime(new Date(end.toNumber() * 1000).toLocaleString("en-US"))
      );
    contract.highestBid().then((bid) => setBid(utils.formatEther(bid)));
  }, []);

  async function connectAccounts() {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    }
  }

  async function handleBid() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(auctionAddress, auction.abi, signer);
    contract
      .bid({ value: utils.parseEther(bidAmount) })
      .then(console.log)
      .then(() => delay(20_000))
      .then(() => contract.highestBid())
      .then((highestBid) => setBid(utils.formatEther(highestBid)))
      .then(() => setBidAmount(0))
      .then(() => window.location.reload());
  }

  return (
    <Container>
      <Button onClick={() => connectAccounts()} id="metamask">
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
              Current Bid: <strong>{bid}</strong>
            </Card.Text>

            <InputGroup>
              <FormControl
                placeholder="Enter bid here..."
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <Button onClick={() => handleBid()}>bid</Button>
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
