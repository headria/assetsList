export interface ITokenContract {
  name: string;
  blockchain: string;
  nomicsId?: string;

  symbol: string;
  contractAddress: string;
  logo?: string;
  owner?: string;
}
