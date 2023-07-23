import { ICompetition } from "@/_types_";
import { ethers } from "ethers";
import { CompetitionBase } from "./interfaces";
import { getRPC } from "./utils/common";
import { getCompetitionAbi } from "./utils/getAbis";
import { SMART_ADDRESS } from "./utils/getAddress";
import {TransactionResponse} from '@ethersproject/abstract-provider';

export default class Competition extends CompetitionBase {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, SMART_ADDRESS["competitionV2"], getCompetitionAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }


  getCompetition = async (id: number) => {
    const competition = await this._contract.getCompetition(id);
    return competition;
  }

  getParticipants = async (id: number) => {
    const participants = await this._contract.getParticipants(id);
    return participants;
  }

  async requestResult(id: number) {
    const tx: TransactionResponse = await this._contract.requestResult(id);   
    return this._handleTransactionResponse(tx);
  }
  
}
