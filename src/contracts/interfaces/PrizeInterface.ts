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

  async mintTo(to: string, taskId: number, amount: number, ratio: number[]): Promise<number> {
    return this._contract.mintTo(to, taskId, amount, ratio);   
  }

  async checkIsActive(id: number): Promise<boolean> { 
    return this._contract.checkIsActive(id);
  }

  async fund(id: number, amount: number) {
    return this._contract.fund(id, amount);
  }

  
}

export default Competition;
