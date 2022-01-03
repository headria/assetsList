export interface ITokenContract {
  name: string;
  blockchain: string;

  symbol: string;
  contractAddress: string;
  logo?: string;
  owner?: string;
}
