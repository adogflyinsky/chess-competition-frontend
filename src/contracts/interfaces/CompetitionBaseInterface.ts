import {BigNumber, ethers} from 'ethers';
import {TransactionResponse} from '@ethersproject/abstract-provider';
import BaseInterface from './BaseInterface';

class CompetitionBase extends BaseInterface {
  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    address: string,
    abi: ethers.ContractInterface,
    ) {
      super(provider, address, abi);
  }

  async create(id: number, prizeAmount: number, endTime: number) {
    const tx: TransactionResponse = await this._contract.create(id, prizeAmount, endTime);
    return this._handleTransactionResponse(tx);  
  }

  async remove(id: number) {
    const tx: TransactionResponse = await this._contract.remove(id);   
    return this._handleTransactionResponse(tx);  
  }

  async start(id: number, prizeRatio: number[], participants: string[]) {
    const tx: TransactionResponse = await this._contract.start(id, prizeRatio, participants);  
    return this._handleTransactionResponse(tx);   
  }

  async fillData(id: number, data: number) {
    const tx: TransactionResponse = await this._contract.fillData(id, data);   
    return this._handleTransactionResponse(tx);  
  }

  async finish(id: number) {
    const tx: TransactionResponse = await this._contract.finish(id);   
    return this._handleTransactionResponse(tx);  
  }
  

  async getProof(id: number, data: string): Promise<number> {
    const proof = await this._contract.getProof(id, data);  
    return this._toNumber(proof);
  }
  

}

export default CompetitionBase;
