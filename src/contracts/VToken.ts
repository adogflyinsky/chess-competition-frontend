import { ethers } from "ethers";
import { BaseInterface, Erc20 } from "./interfaces";
import { getVTokenAbi } from "./utils/getAbis";
import { SMART_ADDRESS } from "./utils/getAddress";

export default class VToken extends Erc20 {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, SMART_ADDRESS['vToken'], getVTokenAbi());
  }
}