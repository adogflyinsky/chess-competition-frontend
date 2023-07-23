import { INftItem } from "@/_types_";
import { BigNumber, ethers } from "ethers";
import {TransactionResponse} from '@ethersproject/abstract-provider';
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getCompetitionTokenAbi } from "./utils/getAbis";
import { SMART_ADDRESS } from "./utils/getAddress";

export default class CompetitionToken extends Erc721 {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, SMART_ADDRESS["competitionToken"], getCompetitionTokenAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  owner = async (): Promise<string> => {
    return await this._contract.owner();
  }

  listTokenIds = async (address: string) => {
    const urls: BigNumber[] = await this._contract.listTokenIds(address);
    const ids = await Promise.all(urls.map((id) => this._toNumber(id)));
    return ids;
  };
  idToNFT = async (id: number): Promise<INftItem> => {
    const url = await this._contract.tokenURI(id);
    const image = "pawn.png";
    const item: INftItem = { id, image, url };
    return item;
  }
  getListNFT = async (address: string): Promise<INftItem[]> => {
    const ids = await this.listTokenIds(address);
    return Promise.all(
      ids.map(async (id) => this.idToNFT(id))
    );
  };

  mintTo = async (address: string) => {
    const tx: TransactionResponse = await this._contract.mintTo(address);
    return this._handleTransactionResponse(tx);
    }
  
}
