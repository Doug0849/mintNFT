import {
  Box,
  Button,
  Flex,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
  useToast,
  Heading,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NoSSRWrapper from "../components/NoSSRWrapper";
import { useEffect, useState } from "react";
import useNFTMint from "../hooks/NFT/useNFTMint";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import useNFTWhiteListMint from "../hooks/NFT/useNFTWhiteListMint";
import { NFTAddress } from "../constants";

const NFT: NextPage = () => {
  const [mintCount, setMintCount] = useState<number>(1);
  const { mint, hash, status, tokenID }: any = useNFTMint(mintCount);
  const { whiteListMint, whash, wstatus, WtokenID }: any =
    useNFTWhiteListMint(mintCount);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (status === "completed" || wstatus === "completed") {
      onOpen();
    }
  }, [status, wstatus]);

  return (
    <>
      <NoSSRWrapper>
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box
            p="10px"
            my="10px"
            borderBottom="1px solid #cdcdcd"
            width="80%"
            textAlign="center"
          >
            <Heading>NFTs</Heading>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
            >
              <NumberInput
                mt={5}
                onChange={(v: number) => setMintCount(v)}
                value={mintCount}
                min={1}
                max={10}
                width="300px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              {hash && (
                <Link
                  href={`https://goerli.etherscan.io/tx/${hash}`}
                  isExternal
                >
                  Transactions Hash: {hash} <ExternalLinkIcon mx="2px" />
                </Link>
              )}
              {/* <pre>Status: {statusMintNFT}</pre> */}
              <Flex justifyContent="center" gap="6">
                <Flex direction="column">
                  <Button
                    colorScheme="blue"
                    mt={5}
                    onClick={async () => {
                      let tx = await mint();

                      // let freeMintTx = await freeMint?.();
                      // await freeMintTx?.wait();
                      // toast({
                      //   title: "Transaction Success!",
                      //   description: "Function: Mint",
                      //   status: "success",
                      //   duration: 5000,
                      //   isClosable: true,
                      // });
                    }}
                  >
                    Mint NFT
                  </Button>
                  <Text>Mint Status: {status}</Text>
                </Flex>

                <Flex direction="column">
                  <Button
                    colorScheme="orange"
                    mt={5}
                    onClick={async () => {
                      let tx = await whiteListMint();

                      // let freeMintTx = await freeMint?.();
                      // await freeMintTx?.wait();
                      // toast({
                      //   title: "Transaction Success!",
                      //   description: "Function: Mint",
                      //   status: "success",
                      //   duration: 5000,
                      //   isClosable: true,
                      // });
                    }}
                  >
                    Whitelist Mint NFT
                  </Button>
                  <Text>Whitelist Mint Status: {wstatus}</Text>
                </Flex>
              </Flex>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Mint Success</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Your NFT has been minted!
                    <br />
                    <br />
                    <Text>
                      You can check on Goerli Testnet
                    </Text>
                    <Link
                      href={`https://goerli.etherscan.io/tx/${hash || whash}`}
                      isExternal
                    >
                      Your Transfer Hash : {hash || whash}
                      <ExternalLinkIcon mx="2px" />
                    </Link>
                    <br />
                    <br />
                    <Text>Your NFT TokenID : {tokenID || WtokenID}</Text>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Link
                      href={`https://testnets.opensea.io/assets/goerli/${NFTAddress}/${
                        tokenID || WtokenID
                      }`}
                      isExternal
                    >
                      <Button variant="ghost">Check NFT On OpenSea</Button>
                    </Link>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </Box>
        </Flex>
      </NoSSRWrapper>
    </>
  );
};

export default NFT;
