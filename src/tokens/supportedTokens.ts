import { ITokenContract } from "../interfaces/tokens";

export const supportedTokens: ITokenContract[] = [
  {
    contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    symbol: "USDT",
    nomicsId: "USDT",
    blockchain: "TRC20",
    name: "Tether USD (USDT)",
    logo: "https://coin.top/production/logo/usdtlogo.png",
    owner: "THPvaUhoh2Qn2y9THCZML3H815hhFhn5YC",
  },
  {
    contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    symbol: "USDT",
    nomicsId: "USDT",
    blockchain: "ERC20",
    name: "Tether USD (USDT)",
    logo: "https://coin.top/production/logo/usdtlogo.png",
  },
  {
    contractAddress: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
    symbol: "SAND",
    nomicsId: "SAND2",
    blockchain: "ERC20",
    name: "The Sandbox",
    logo: "https://etherscan.io/token/images/sand_32.png",
  },
  {
    contractAddress: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
    symbol: "MANA",
    nomicsId: "MANA",
    blockchain: "ERC20",
    name: "Decentraland MANA",
    logo: "https://etherscan.io/token/images/decentraland_256.png",
  },
];
