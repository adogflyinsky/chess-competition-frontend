import {ethers} from 'ethers';
import {TransactionResponse} from '@ethersproject/abstract-provider';
import BaseInterface from './BaseInterface';

class Erc20 extends BaseInterface { 
  constructor(provider: ethers.providers.Web3Provider, address: string, abi: ethers.ContractInterface) {
      super(provider, address, abi)  
  }

  async balanceOf(walletAddress: string): Promise<number> {
    const balance = await this._contract.balanceOf(walletAddress);    
    return this._toNumber(balance);
  }

  async owner(): Promise<string>  {
    return this._contract.owner();
  }

  async allowance(owner: string, spender: string): Promise<number> {
    const amount = await this._contract.allowance(owner, spender);
    return this._toNumber(amount);
  }

  async totalSupply(): Promise<number> {
    const total = await this._contract.totalSupply();
    return this._toNumber(total);
  }

  async name(): Promise<string> {
    return this._contract.name();
  }

  async symbol(): Promise<string> {
    return this._contract.symbol();
  }

  async approve(address: string, amount: number) {
    const tx: TransactionResponse = await this._contract.approve(address, amount, this._option);
    return this._handleTransactionResponse(tx);
  }
}

export default Erc20;
