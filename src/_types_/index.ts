export interface IWalletInfo {
  address: string;
  bnb: number;
}

export interface IRate {
  usdtRate: number;
  bnbRate: number;
}

export enum TOKEN {
  VToken = "VToken",
}


export interface IMenu {
  name: string;
  url: string;
}

export interface IAttribute {
  trait_type: string;
  value: string | number;
}

export interface INftItem {
  id: number;
  image: string;
  url: string;
}

export type ActionType = "CREATE" | "REMOVE" | "START" | "FILLDATA" | "REQUEST" |"FINISH";