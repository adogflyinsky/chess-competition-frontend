import { INftItem } from "@/_types_";
import { BigNumber, ethers } from "ethers";
import { Competition } from "./interfaces";
import { getRPC } from "./utils/common";
import { getCompetitionChessPuzzleAbi } from "./utils/getAbis";
import { SMART_ADDRESS } from "./utils/getAddress";

export default class CompetitionChessPuzzleContract extends Competition {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, SMART_ADDRESS["CompetitionChessPuzzle"], getCompetitionChessPuzzleAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }
  async create(id: number, prizeId: number) {
    return this._contract.create(id, prizeId);
  }
  async requestResult(id: string) {
    return this._contract.requestResult(id);   
  }
  
}
