import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { LoggerService } from "../../logger";

const provider =
  "https://eth.getblock.io/mainnet/?api_key=2e89aac7-4985-4684-9547-fd4956bbd784";

const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

// The minimum ABI required to get the ERC20 Token balance
const minABI: AbiItem[] = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

export const getBalanceERC20 = async (
  contractAddress: string,
  walletAddress: string
): Promise<string | undefined> => {
  try {
    const contract = new Web3Client.eth.Contract(minABI, contractAddress);
    const result = await contract.methods.balanceOf(walletAddress).call();

    const format = Web3Client.utils.fromWei(result);

    return format;
  } catch (e) {
    LoggerService.error(e);
  }
};
