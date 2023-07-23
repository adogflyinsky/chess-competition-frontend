export interface IWalletInfo {
  address: string;
  bnb: number;
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

export interface IVault {
  token: string;
  value: number;
}

export interface IExchange {
  from: IVault;
  to: IVault;
}

export interface ICompetition {
  owner: string;
  id: number;
  participants: string[];
  startTime: number;
  result: string;
}

export interface IPrizeInfo {
  sender: string;
  id: number;
  taskId: number;
  amount: number;
  ratio: number[];
  isActive: boolean;
  
}

export interface IParticipant {
  address: string,
  competitionId: number,
}

export interface IUser {
  address: string,
  balance: number
}

export interface IUserInfo {
  address: string,
  email: string,
}

export type ActionType = "APPROVE" | "CREATE" | "REMOVE" | "JOIN" | "START" | "FILLDATA"| "GETPROOF" | "REQUEST"| "FILLRESULT" | "FINISH";