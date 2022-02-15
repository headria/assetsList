import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { LoggerService } from "../../logger";
import { abiData } from "../../utils/abi";

const provider =
  "https://eth.getblock.io/mainnet/?api_key=2e89aac7-4985-4684-9547-fd4956bbd784";

const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

export const getBalanceERC20 = async (
  contractAddress: string,
  walletAddress: string
): Promise<string | undefined> => {
  try {
    const contract = new Web3Client.eth.Contract(abiData, contractAddress);

    const result = await contract.methods.balanceOf(walletAddress).call({});

    if (!result) return "0";

    const format = Web3Client.utils.fromWei(result);

    return format;
  } catch (e: any) {
    // NOTE - if error for gas happened most time its for worng address and contract address. maybe the dev mix them togther
    LoggerService.error(`[getBalanceERC20] -- err: ${e.toString()}`);
    return "0";
  }
};
