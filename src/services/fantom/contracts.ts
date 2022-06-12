import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { LoggerService } from "../../logger";
import bn from "bn.js";

const provider = "https://rpc.ankr.com/fantom";

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
    if (!result) return "0";

    if (contractAddress === "0xba2ae424d960c26247dd6c32edc70b295c744c43") {
      const newNumber = new bn(result);
      console.log(newNumber);
      const satoshiUnit = new bn(100000000);
      console.log(newNumber.div(satoshiUnit).toString());
      return newNumber.div(satoshiUnit).toString();
    }
    const format = Web3Client.utils.fromWei(result);

    return format;
  } catch (e: any) {
    // NOTE - if error for gas happened most time its for worng address and contract address. maybe the dev mix them togther
    LoggerService.error(`[getBalanceBEP20] err:${e.toString()}`);
    return "0";
  }
};
