import {
  Button,
  Box,
  Text,
  Image,
  Link,
  Heading,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import Web3 from "web3";
import { formatEther } from "@ethersproject/units";
import tardigradeImg from "../assets/tardigrade/Store.png";
import logo from "../assets/alphaBytes.png";
import Identicon from "./Identicon";
import chestImage from "../assets/chest.gif";
import chest from "../assets/chest.jpg";
import bottomlogo from "../assets/bottom_logo.png";
import rarity_1 from "../assets/rarity_1.jpg";
import rarity_2 from "../assets/rarity_2.jpg";
import rarity_3 from "../assets/rarity_3.jpg";

import SmartContract from "../contract/AlphaMint/alphaByte";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import CardCollectionDetails from "./CardCollectionDetails";
import { removeAllListeners } from "process";
import { useDisclosure } from "@chakra-ui/react";
import config from "../config";

type Props = {
  handleOpenModal: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account } = useEthers();
  const [spin, setSpin] = useState(false);
  const [notification, setNotification] = useState("");
  const [imageItem, setImageItem] = useState(false);
  const [amount, setAmount] = useState(0);
  const etherBalance = useEtherBalance(account);
  const [tokenIDs, settokenIDs] = useState<Array<any>>([]);
  const [image, setImage] = useState("");
  const [metadata, setMetadata] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalName, setModalName] = useState("");
  const [modalImage, setModalImage] = useState("");
  const [modalDna, setModalDna] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalCreator, setModalCreator] = useState("");
  const [modalAttribute, setModalAttribute] = useState<Array<any>>([]);

  const OverlayOne = () =>
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />;
  const [overlay, setOverlay] = useState(<OverlayOne />);

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

  async function getMetadata() {
    const data = await (await fetch(config.metadata_url)).json();
    setMetadata(data);
  }

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  async function getMintedList() {
    try {
      const balance = await SmartContract.methods.balanceOf(account).call();
      let temp = [];
      for (var i = 0; i < balance; i++) {
        const token_id = await SmartContract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();
        console.log("token_id", token_id);
        temp.push(token_id);
      }
      settokenIDs(temp);
      return true;
    } catch (e) {
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

  async function getClaimStatus(tokenID: any) {
    if ((window as any).ethereum) {
      await (window as any).ethereum.send("eth_requestAccounts");
      (window as any).web3 = new Web3((window as any).ethereum);

      try {
        const flag = await SmartContract.methods.claimed(tokenID).call();
        console.log("getClaimStatus", tokenID, flag);
        return flag;
      } catch (e) {
        setNotification("Minting was not successful");
        setSpin(false);
      }
    } else {
      setNotification("Please install Metamask to use this dApp!");
      setSpin(false);
    }
    return false;
  }

  async function reveal(tokenID: any) {
    const _tokenID = tokenID - 1;
    console.log(metadata[_tokenID]);
    console.log(metadata[_tokenID]["description"]);
    console.log("attributes", metadata[_tokenID]["attributes"]);
    setModalName(metadata[_tokenID]["name"]);
    setModalDna(metadata[_tokenID]["dna"]);
    setModalDescription(metadata[_tokenID]["description"]);
    setModalCreator(metadata[_tokenID]["creator"]);
    setModalAttribute([...metadata[_tokenID]["attributes"]]);
    setModalImage(
      config.physical_image_url +
        metadata[_tokenID]["attributes"][0]["value"] +
        ".png"
    );
    onOpen();
    setOverlay(<OverlayOne />);
  }
  async function claim(tokenID: any) {
    console.log("claim", tokenID);
    setSpin(true);
    reveal(tokenID);
    if ((window as any).ethereum) {
      await (window as any).ethereum.send("eth_requestAccounts");
      (window as any).web3 = new Web3((window as any).ethereum);

      try {
        SmartContract.methods
          .claim(tokenID)
          .send({ from: account })
          .on("transactionHash", (hash: any) => {
            console.log("https://etherscan.io/tx/", hash);
          })
          .on("error", (error: any, receipt: any) => {
            console.log(error);
          });
      } catch (e) {
        setNotification("Minting was not successful");
        setSpin(false);
      }
    } else {
      setNotification("Please install Metamask to use this dApp!");
      setSpin(false);
    }
  }

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
                    {tokenIDs.length}
                  </span>
                </Box>
                <Box
                  alignItems={"center"}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  {imageItem
                    ? <Image
                        borderRadius={5}
                        src={image}
                        alt="logo"
                        width={"30vw"}
                      />
                    : <Image
                        borderRadius={5}
                        src={chestImage}
                        alt="logo"
                        width={"30vw"}
                      />}
                </Box>
                <Box
                  alignItems={"center"}
                  display={"flex"}
                  margin={"10px 0 "}
                  justifyContent={"center"}
                >
                  <Image
                    borderRadius={5}
                    src={rarity_1}
                    alt="logo"
                    width={"40vw"}
                  />
                </Box>
                <Box
                  alignItems={"center"}
                  display={"flex"}
                  margin={"10px 0 "}
                  justifyContent={"center"}
                >
                  <Image
                    borderRadius={5}
                    src={rarity_3}
                    alt="logo"
                    width={"40vw"}
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
                  My AlphaBYTEs
                </Heading>
                <Grid
                  templateColumns={
                    tokenIDs.length === 1
                      ? ["repeat(1, 1fr)", "repeat(1, 1fr)"]
                      : tokenIDs.length === 2
                        ? ["repeat(1, 1fr)", "repeat(2, 1fr)"]
                        : ["repeat(1, 1fr)", "repeat(3, 1fr)"]
                  }
                  width={"70%"}
                  marginLeft={"20%"}
                  textAlign={"center"}
                  justifyContent="center"
                >
                  {tokenIDs.length > 0
                    ? tokenIDs.map((tokenID, index) => {
                        return (
                          <GridItem w="100%" key={index}>
                            <Grid
                              templateColumns={[
                                "repeat(1, 1fr)",
                                "repeat(1, 1fr)",
                              ]}
                              textAlign={"center"}
                              key={index}
                            >
                              <CardCollectionDetails
                                // mint={mint}
                                // handleAmount={handleAmount}
                                mint={() => {
                                  claim(tokenID);
                                }}
                                ImagePath={`${config.metadata_image_url}${tokenID}.png`}
                                // ImagePath={chestImage}
                                reveal={() => reveal(tokenID)}
                                claimed={getClaimStatus(tokenID)}
                                tokenID={tokenID}
                                name={`The AlphaBYTEs #${tokenID}`}
                                price_d="Whitelist 0.8 ETH || Public Mint 1.0"
                                amount={amount}
                              />
                            </Grid>
                          </GridItem>
                        );
                      })
                    : <GridItem colStart={1} colEnd={4} color="white">
                        <Box
                          justifyContent={"center"}
                          alignItems={"center"}
                          display={"flex"}
                          flexDirection={"column"}
                          background={"rgba(32, 32, 32, 0.6)"}
                          padding={"30px"}
                        >
                          <Text fontSize="4xl">No Minted</Text>
                        </Box>
                      </GridItem>}
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
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent background={"rgba(34,34,34,0.3)"}>
              <ModalHeader color="white">
                {modalName}
              </ModalHeader>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  borderRadius="md"
                  borderWidth={"1px"}
                  borderColor={"rgb(200,200,200)"}
                  background={"rgba(10,10,10)"}
                  color="white"
                  onClick={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
              {/* <ModalCloseButton /> */}
              <ModalBody>
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  display={"flex"}
                  flexDirection={"column"}
                  background={"rgba(34,34,34,0.8)"}
                  padding={"30px 15px"}
                >
                  <Image src={modalImage} width="100%" margin={"20px"} />
                  <Text color={"white"} margin={"5px 0"}>
                    {modalName}
                  </Text>
                  <Text color={"white"} margin={"5px 0"}>
                    Creator: {modalCreator}
                  </Text>

                  {modalAttribute.map((value, idx) => {
                    return (
                      <Text color={"white"}>
                        <p>
                          {value.trait_type} : {value.value}{" "}
                        </p>
                      </Text>
                    );
                  })}
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
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
