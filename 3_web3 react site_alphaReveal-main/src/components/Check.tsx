import {
  Button,
  Box,
  Text,
  Image,
  Link,
  Heading,
  Grid,
  GridItem,
  Container,
  FormControl,
  FormLabel,
  Input,
  Switch,
} from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import Web3 from "web3";
import { formatEther } from "@ethersproject/units";
import tardigradeImg from "../assets/tardigrade/Store.png";
import logo from "../assets/alphaBytes.png";
import Identicon from "./Identicon";
import chestImage from "../assets/chest.gif";
import chest from "../assets/chest.jpg";
import SmartContract from "../contract/AlphaMint/alphaByte";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import CardCollectionDetails from "./CardCollectionDetails";
import config from "../config";

type Props = {
  handleOpenModal: any;
};

export default function Check({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account } = useEthers();
  const [spin, setSpin] = useState(false);
  const [notification, setNotification] = useState("");
  const [imageItem, setImageItem] = useState(false);
  const [amount, setAmount] = useState("1");
  const [tokenID, setTokenID] = useState(1);
  const etherBalance = useEtherBalance(account);
  const [tokenIds, setTokenIds] = useState<Array<any>>([]);
  const [metadata, setMetadata] = useState([]);
  const [image, setImage] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [tokenURI, setTokenURI] = useState("");

  useEffect(() => {
    getMetadata();
    const ethEnabled = async () => {
      if ((window as any).ethereum) {
        await (window as any).ethereum.send("eth_requestAccounts");
        (window as any).web3 = new Web3((window as any).ethereum);
        (window as any).web3.eth.net
          .getId()
          .then((networkId: any) => {
            if (networkId !== 1) {
              setNotification("Change metamask network to Ethereum Mainnet");
            }
          })
          .catch((err: any) => {
            setNotification("Can't detect your Metamask Network");
          });
        return true;
      }
      setNotification("Web3 is not defined");
      return false;
    };
    if (!ethEnabled()) {
      setNotification("Please install Metamask to use this dApp!");
    }
  }, []);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  async function getMintedList() {
    console.log("getMintedList");
    try {
      const balance = await SmartContract.methods.balanceOf(account).call();
      console.log("balance", balance);
      let temp = [];
      for (var i = 0; i < balance; i++) {
        const token_id = await SmartContract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();
        console.log("token_id", token_id);
        temp.push(token_id);
        if (i === 0) temp.push(token_id);
      }
      setTokenIds(temp);
      console.log("tokenIds", temp);
      return true;
    } catch (e) {
      console.log(e);
      setSpin(false);
    }
    return false;
  }

  useEffect(
    () => {
      if (account) {
        getMintedList();
      }
    },
    [account]
  );

  async function getMetadata() {
    const data = await (await fetch(config.metadata_url)).json();
    setMetadata(data);
  }

  async function checkClaimed() {
    if ((window as any).ethereum) {
      await (window as any).ethereum.send("eth_requestAccounts");
      (window as any).web3 = new Web3((window as any).ethereum);

      try {
        const flag = await SmartContract.methods.claimed(tokenID).call();
        setClaimed(flag);
        const _tokenID = tokenID - 1;
        setImage(
          config.physical_image_url +
            metadata[_tokenID]["attributes"][0]["value"] +
            ".png"
        );
        // setSource();
      } catch (e) {}
    }
  }
  const setSource = () => {
    try {
      console.log("data", metadata);
      setImage(
        "https://ipfs.io/ipfs/bafybeihsw4x6kak4s77yify46rn7r2sbj4exw2vj67l5zjte3p2t7emyd4/" +
          tokenID +
          ".png"
      );
    } catch (err) {
      //Do whatever you want when the image failed to load here
      console.log("error11");
      setImage(chestImage);
    }
  };

  return account
    ? <div style={{ background: "rgba(0,0,0,0.5)" }}>
        <Box
          display="flex"
          alignItems="center"
          background="gray.700"
          borderRadius="xl"
          py="0"
          position="absolute"
          right="20px"
          top="20px"
        >
          <Box px="3">
            <Text color="white" fontSize="md">
              {etherBalance &&
                parseFloat(formatEther(etherBalance)).toFixed(3)}{" "}
              ETH
            </Text>
          </Box>
          <Button
            onClick={handleOpenModal}
            bg="gray.800"
            border="1px solid transparent"
            _hover={{
              border: "1px",
              borderStyle: "solid",
              borderColor: "blue.400",
              backgroundColor: "gray.700",
            }}
            borderRadius="xl"
            m="1px"
            px={3}
            height="38px"
          >
            <Text color="white" fontSize="md" fontWeight="medium" mr="2">
              {account &&
                `${account.slice(0, 6)}...${account.slice(
                  account.length - 4,
                  account.length
                )}`}
            </Text>
            <Identicon />
          </Button>
        </Box>
        <div id="society" style={{ margin: "auto" }}>
          <div
            className="main-content"
            style={{ padding: "0 20px", margin: "auto" }}
          >
            <Box
              marginBottom={15}
              style={{
                position: "absolute",
                top: 0,
                left: 20,
                maxWidth: "80px",
              }}
            >
              <Image borderRadius={5} src={logo} alt="logo" />
            </Box>
            <Box px="3" marginTop="15vh" textAlign="center">
              <Text
                color="white"
                fontSize="md"
                textAlign="center"
                marginBottom="2vw"
              >
                Claim your AlphaBYTE and join the {""}
                <Link
                  href="https://discord.gg/pSBMtAttbJ"
                  isExternal
                  color="#fff"
                >
                  discord <ExternalLinkIcon mx="2px" />
                </Link>
              </Text>
            </Box>
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)"]}>
              <GridItem w="100%" colSpan={1} marginTop={"60px"}>
                <Box
                  color="white"
                  marginTop="3px"
                  bg={"rgb(50,50,50,0.3)"}
                  padding={3}
                  justifyContent="space-between"
                  flexDirection="row"
                  display={"flex"}
                  cursor={"pointer"}
                >
                  <span>MetaREVERSED</span>
                  <span
                    style={{ padding: "2px 5px", background: "rgb(34,34,34)" }}
                  >
                    1
                  </span>
                </Box>
                <Box
                  alignItems={"center"}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Image
                    borderRadius={5}
                    src={image ? image : chestImage}
                    alt="logo"
                    width={"30vw"}
                  />
                </Box>
              </GridItem>
              <GridItem w="100%" colSpan={2} padding={"0 20px"}>
                <Heading
                  color="#fff"
                  margin={"10px 0 "}
                  textAlign={"center"}
                  borderBottomColor={"rgb(100,100,100)"}
                  borderBottomWidth={"1px"}
                >
                  The AlphaBYTEs Available
                </Heading>
                <Grid
                  templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)"]}
                  width={"70%"}
                  marginLeft={"20%"}
                  textAlign={"center"}
                  justifyContent="center"
                >
                  <Box px="3" marginTop="10vh" textAlign="center" color="white">
                    <FormControl>
                      <FormLabel htmlFor="text">Enter token ID</FormLabel>
                      <Input
                        id="text"
                        type="text"
                        value={tokenID}
                        onChange={(e: any) => setTokenID(e.target.value)}
                      />
                      <Container
                        marginTop="15px"
                        maxW="200"
                        p={4}
                        h={58}
                        centerContent
                      >
                        <Button
                          size="md"
                          height="48px"
                          width="200px"
                          border="2px"
                          color="green"
                          borderColor="green.500"
                          variant="outline"
                          onClick={() => {
                            checkClaimed();
                          }}
                        >
                          Check
                        </Button>
                      </Container>
                      <FormControl
                        display="flex"
                        marginTop="25px"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                      >
                        <FormLabel htmlFor="email-alerts" mb="0">
                          {claimed ? "Claimed" : "Unclaimed"}
                        </FormLabel>
                        <Switch
                          id="email-alerts"
                          colorScheme="green"
                          size="lg"
                          isChecked={claimed}
                        />
                      </FormControl>
                    </FormControl>
                  </Box>
                </Grid>
              </GridItem>
            </Grid>
            <Text
              color="red"
              fontSize="md"
              textAlign="center"
              marginBottom={notification !== "" ? "2vw" : "0vw"}
            >
              {notification}
            </Text>
          </div>
          <Box px="3" marginTop="15px" textAlign="center">
            <Text
              color="white"
              fontSize="md"
              textAlign="center"
              marginBottom="2vw"
            >
              Please make sure you are connected to the right network (Eth
              Mainnet) to reveal your physical. Please note: Once you submit for
              claimed you will be contacted by the AlphaBYTE team to complete
              your shipping process. This will mark your NFT as claimed and
              cannot be undone.
            </Text>
          </Box>
        </div>
      </div>
    : <Box textAlign="center">
        <Box
          marginBottom={15}
          style={{ position: "absolute", top: 0, left: 20, maxWidth: "80px" }}
        >
          <Image borderRadius={5} src={chestImage} alt="logo" />
        </Box>
        <Heading marginBottom="10vh" color="#fff">
          Welcome to The AlphaBYTEs MetaREVERSED reveal page
        </Heading>
        <Text marginBottom="5vh" color="#fff">
          Connect to your MetaMask to proceed with claiming your slice of the
          physical art sculpture
        </Text>
        <Button
          onClick={handleConnectWallet}
          bg="blue.800"
          color="blue.300"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          border="1px solid transparent"
          _hover={{
            borderColor: "blue.700",
            color: "blue.400",
          }}
          _active={{
            backgroundColor: "blue.800",
            borderColor: "blue.700",
          }}
        >
          Connect to a wallet
        </Button>
      </Box>;
}
