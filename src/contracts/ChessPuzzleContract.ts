import { INftItem } from "@/_types_";
import { BigNumber, ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getChessPuzzleAbi } from "./utils/getAbis";
import { SMART_ADDRESS } from "./utils/getAddress";

export default class ChessPuzzleContract extends Erc721 {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, SMART_ADDRESS["ChessPuzzle"], getChessPuzzleAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  private _listPuzzleIds = async (address: string) => {
    const urls: BigNumber[] = await this._contract.listPuzzleIds(address);
    const ids = await Promise.all(urls.map((id) => this._toNumber(id)));
    return ids;
  };
  async getMinterRole()  {
    return await this._contract.MINTER_ROLE();
  }

  getListNFT = async (address: string): Promise<INftItem[]> => {
    const ids = await this._listPuzzleIds(address);
    return Promise.all(
      ids.map(async (id) => {
        const url = await this._contract.tokenURI(id);
        const image = id.toString() + ".png";
        const item: INftItem = { id, image, url };
        return item;
      })
    );
  };
}
