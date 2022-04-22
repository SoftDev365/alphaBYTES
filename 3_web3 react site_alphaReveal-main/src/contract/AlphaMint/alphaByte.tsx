import Web3 from "web3";
import Build from "./alphaByte.json";

let tokenContract: any;
// let window: any;
if ((window as any).ethereum) {
  (window as any).ethereum.send("eth_requestAccounts");
  (window as any).web3 = new Web3((window as any).ethereum);

  const { abi } = Build;

  tokenContract = new (window as any).web3.eth.Contract(
    abi as any,
    // "0xfD558ad70A4197fc024645512c34928eb2c1284a" kovan network
    "0x0075Ce3F8d2CECaE84600D4A1F8675a72819896d"
    // "0x5D3777F58a01811a3826fA99849676Dd4505863A" rinkeby network
  );
}

export default tokenContract;

