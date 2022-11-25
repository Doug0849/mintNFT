import { useAccount, useContractWrite, useContractEvent } from "wagmi";
import { utils } from "ethers";
import nftAbi from "../../abis/nftAbi.json";
import { NFTAddress, WHITELIST_PRICE } from "../../constants";
import { useState } from "react";
import WHITELIST from "../../constants/NFTs/whitelist.json"

const getWhieListData = (address: string) => {
  if (!address) {
    console.log('This address is not exist')
  }
  let whiteListData = new Map(Object.entries(WHITELIST))
  let useWhiteListData = whiteListData.get(address?.toLowerCase());
  let voucher = { redeemer: "" }
  let signature = ""
  let isWhitelist = false
  if (useWhiteListData) {
    voucher = useWhiteListData.voucher
    signature = useWhiteListData.signature
    isWhitelist = true;
  }
  return {
    voucher, signature, isWhitelist
  }
}



const useNFTWhiteListMint = (_mintCount: number) => {
  const { address } : any = useAccount();
  const [wstatus, setWstatus] = useState("idle");
  const [whash, setWhash] = useState("");
  const [WtokenID, setWtokenID] = useState("");
  const { voucher, signature, isWhitelist } = getWhieListData(address || "");
  const totalValue = WHITELIST_PRICE * _mintCount;

  useContractEvent({
    address: NFTAddress,
    abi: nftAbi,
    eventName: "Transfer",
    listener(from, to, tokenId) {
      const intTokenId = parseInt(tokenId, 10).toString();
      setWtokenID(intTokenId);
    },
    chainId: 5,
  });

  const {
    writeAsync,
    status: Wstatus,
    data,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: NFTAddress,
    abi: nftAbi,
    functionName: "whitelistMint",
    args: [ voucher, signature, _mintCount.toString(), address],
    overrides: {
      value: utils.parseEther(totalValue.toString()),
    },
  });

  return {
    whiteListMint: async () => {
      setWstatus("minting");
      let tx = await writeAsync();
      setWhash(tx.hash);
      setWstatus("wating");
      await tx?.wait();
      setWstatus("completed");
    },
    wstatus,
    whash,
    WtokenID,
  };
};

export default useNFTWhiteListMint;
