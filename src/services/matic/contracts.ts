import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { LoggerService } from "../../logger";

const provider =
  "https://bsc.getblock.io/mainnet/?api_key=2e89aac7-4985-4684-9547-fd4956bbd784";

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

export const getBalanceBEP20 = async (
  contractAddress: string,
  walletAddress: string
): Promise<string | undefined> => {
  try {
    const contract = new Web3Client.eth.Contract(minABI, contractAddress);
    const result = await contract.methods.balanceOf(walletAddress).call();

    const format = Web3Client.utils.fromWei(result);

    return format;
  } catch (e: any) {
    LoggerService.error(`[getBalanceBEP20] err:${e.toString()}`);
  }
};

const transactionListQuery = `
{
  ethereum(network: bsc) {
    smartContractCalls(
      options: {desc: "block.timestamp.time", limit: 10, offset: 0}, 
      date: {since: "2021-01-01", till: null}, 
      smartContractAddress: {is: "0x2c0f1dc67bc9505e6f867b1ca1b892c59d8e82cf"}) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
        height
      }
      smartContractMethod {
        name
        signatureHash
      }
      address: caller {
        address
      }
      transaction {
        hash
      }
      gasValue
      smartContract{
        contractType
        currency{
          symbol
        }
      }
    }
  }
}
`;
