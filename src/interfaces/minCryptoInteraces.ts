export interface IHistoryParams {
  aggregate?: number;
  e?: string;
  //Symbol name
  fsym?: string;

  limit?: number;
  tryConversion?: boolean;
  //Secind symbol(currency) name
  tsym?: string; //USDT
}

export type KindHistoryType =
  | "24H"
  | "7D"
  | "30D"
  | "60D"
  | "90D"
  | "180D"
  | "365D";
export interface IHistoryDataParams {
  kind: KindHistoryType;
  symbol: string;
}
