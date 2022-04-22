import {
  Button,
  Box,
  Text,
  Image,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input
} from "@chakra-ui/react";
import React, { isValidElement, useCallback } from "react";
import chestImage from "../assets/chest.gif";
import { useDisclosure } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import config from "../config";
import axios from "axios";
type Props = {
  mint: any;
  // handleAmount: any;
  name: any;
  ImagePath: any;
  price_d: any;
  amount: any;
  claimed: any;
  tokenID: any;
  reveal: any;
};

const CardCollectionDetails = ({
  mint,
  name,
  // handleAmount,
  price_d,
  amount,
  ImagePath,
  claimed,
  tokenID,
  reveal
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const OverlayOne = () =>
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />;
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  const [input, setInput] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [address2, setAddress2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [code, setCode] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [image, setImage] = React.useState("");

  const [validation, setValidation] = React.useState(false);

  const handleInputChange = (e: any) => setInput(e.target.value);
  const handleEmail = (e: any) => setEmail(e.target.value);
  const handleAddress1 = (e: any) => setAddress1(e.target.value);
  const handleAddress2 = (e: any) => setAddress2(e.target.value);
  const handleCity = (e: any) => setCity(e.target.value);
  const handleState = (e: any) => setState(e.target.value);
  const handleCountry = (e: any) => setCountry(e.target.value);
  const handleCode = (e: any) => setCode(e.target.value);
  const handlePhone = (e: any) => setPhone(e.target.value);

  const isError = useMemo(
    () => ({
      name: validation ? input === "" : input === "default",
      email: validation ? email === "" : email === "default",
      address1: validation ? address1 === "" : address1 === "default",
      address2: validation ? address2 === "" : address2 === "default",
      city: validation ? city === "" : city === "default",
      state: validation ? state === "" : state === "default",
      country: validation ? country === "" : country === "default",
      code: validation ? code === "" : code === "default",
      phone: validation ? phone === "" : phone === "default"
    }),
    [
      validation,
      address1,
      address2,
      city,
      code,
      country,
      email,
      input,
      phone,
      state
    ]
  );

  const isValid = useMemo(
    () =>
      !isError.name &&
      !isError.email &&
      !isError.address1 &&
      !isError.address2 &&
      !isError.city &&
      !isError.state &&
      !isError.country &&
      !isError.code &&
      !isError.phone,
    [isError]
  );

  const status = "subscribed";
  const tags = ["Art by Amrita"];

  const submit = () => {
    if (!validation) {
      setValidation(true);
    } else {
      if (validation && isValid) {
        //submit
        console.log("submit");
        sendMailChimp();
        mint();
        onClose();
      }
    }
  };

  const sendMailChimp = useCallback(
    () => {
      console.log("sendMailchimp");
      axios
        .post(
          config.heroku_postres_url,
          {
            title:'TheAlphabyte',
            tokeID: tokenID,
            name: input,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            description: code,
            country: country,
            phonenumber: phone
          },
        )
        .then(res => {
          console.log(res);
        });
      axios
        .post(
          config.cors_api_url +
          config.mailchimp_apiRoute +
            "/lists/" +
            config.mailchimp_listid +
            "/members",
          {
            email_address: email,
            merge_fields: {
              FNAME: "tokenID:"+tokenID,
              LNAME: input,
              ADDRESS: {
                addr1: address1,
                addr2: address2,
                country: country,
                city: city,
                state: state,
                zip: code
              },
              PHONE: phone
            },
            status: status,
            tags: tags
          },
          {
            headers: {
              Authorization: "Basic " + config.mailchimp_key,
              "Access-Control-Allow-Origin": "*",
            }
          }
        )
        .then(res => {
          console.log(res);
        });
    },
    [address1, address2, country, city, state, code, phone, email, input, tags]
  );

  useEffect(
    () => {
      if (validation && isValid) {
        //submit
        sendMailChimp();
        mint();
        onClose();
      }
    },
    [validation]
  );

  const setSource = () => {
    try {
      setImage(ImagePath ? ImagePath : chestImage);
    } catch (err) {
      //Do whatever you want when the image failed to load here
      setImage(chestImage);
    }
  };

  useEffect(() => {
    setSource();
  }, []);

  return (
    <GridItem colSpan={1} margin={"10px"}>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"column"}
        background={"rgba(34,34,34,0.3)"}
        padding={"30px 15px"}
      >
        <Image src={image} width="100%" margin={"20px"} />
        <Text color={"white"} margin={"5px 0"}>
          {name}
        </Text>
        <Text color={"white"}>
          TokenID : {tokenID}{" "}
        </Text>
        {/* <Input
          color="white"
          type="text"
          placeholder="Amount"
        /> */}
        <Button
          // onClick={mint}
          onClick={() => {
            reveal();
          }}
          borderWidth={"1px"}
          borderColor={"rgb(200,200,200)"}
          background={"rgba(10,10,10)"}
          color="white"
          borderRadius={"0px"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          margin={"20px 0px"}
        >
          <span>
            Reveal
          </span>
        </Button>
        <Button
          // onClick={mint}
          onClick={() => {
            onOpen();
            setOverlay(<OverlayOne />);
          }}
          borderWidth={"1px"}
          borderColor={"rgb(200,200,200)"}
          background={"rgba(10,10,10)"}
          color="white"
          borderRadius={"0px"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          disabled={!claimed}
        >
          <span>
            {claimed ? "Claim" : "Claimed"}
          </span>
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background={"rgba(34,34,34,0.3)"}>
          <ModalHeader color="white">ShippingForm</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box px="1" marginTop="15px" textAlign="center">
              <FormControl w="100%">
                <FormControl isInvalid={isError.name}>
                  <Input
                    id="name"
                    type="name"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Name"
                    value={input}
                    onChange={handleInputChange}
                  />
                  {isError.name &&
                    <FormErrorMessage>Name is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.email}>
                  <Input
                    id="name"
                    type="email"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmail}
                  />
                  {isError.email &&
                    <FormErrorMessage>Email is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.address1}>
                  <Input
                    id="name"
                    type="text"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Address 1"
                    value={address1}
                    onChange={handleAddress1}
                  />
                  {isError.address1 &&
                    <FormErrorMessage>Address is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.address2}>
                  <Input
                    id="name"
                    type="text"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Address 2"
                    value={address2}
                    onChange={handleAddress2}
                  />
                  {isError.address2 &&
                    <FormErrorMessage>Address is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.city}>
                  <Input
                    id="name"
                    type="text"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="City"
                    value={city}
                    onChange={handleCity}
                  />
                  {isError.city &&
                    <FormErrorMessage>City is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.state}>
                  <Input
                    id="name"
                    type="email"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="State"
                    value={state}
                    onChange={handleState}
                  />
                  {isError.state &&
                    <FormErrorMessage>State is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.country}>
                  <Input
                    id="name"
                    type="email"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Country"
                    value={country}
                    onChange={handleCountry}
                  />
                  {isError.country &&
                    <FormErrorMessage>Country is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.code}>
                  <Input
                    id="name"
                    type="email"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Code"
                    value={code}
                    onChange={handleCode}
                  />
                  {isError.code &&
                    <FormErrorMessage>Post Code is required.</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={isError.phone}>
                  <Input
                    id="name"
                    type="email"
                    background="white"
                    borderColor="yellow.300"
                    variant="outline"
                    margin="10px"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhone}
                  />
                  {isError.phone &&
                    <FormErrorMessage>
                      Phone Number is required.
                    </FormErrorMessage>}
                </FormControl>
              </FormControl>
            </Box>
          </ModalBody>

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
            <Button
              onClick={submit}
              variant="ghost"
              borderRadius="md"
              borderWidth={"1px"}
              borderColor={"rgb(200,200,200)"}
              background={"rgba(10,10,10)"}
              color="white"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  );
};

export default CardCollectionDetails;
