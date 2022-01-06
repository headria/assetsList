export interface ITokenContract {
  name: string;
  blockchain: string;
  network?: string;
  nomicsId?: string;
  coinType?: number;
  symbol: string;
  contractAddress: string;
  logo?: string;
  owner?: string;
}
