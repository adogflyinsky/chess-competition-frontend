import {ethers} from 'ethers';
import {TransactionResponse} from '@ethersproject/abstract-provider';
import BaseInterface from './BaseInterface';

class Competition extends BaseInterface {
  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    address: string,
    abi: ethers.ContractInterface,
    ) {
      super(provider, address, abi);
  }

  async remove(id: number) {
    return this._contract.remove(id);   
  }

  async start(id: number, participants: string[], endTime: number) {
    return this._contract.start(id, participants, endTime);   
  }

  async fillData(id: number, data: number) {
    return this._contract.fillProof(id, data);   
  }

  async finish(id: number): Promise<number> {
    return this._contract.finish(id);   
  }

  // async getParticipants(id: number): Promise<number[]> {
  //   return this._contract.getParticipants(id);   
  // }

}

export default Competition;
