import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { LoggerService } from "../../logger";
import { abiData } from "../../utils/abi";

const provider =
  "https://mainnet.infura.io/v3/05b9f03885ae4bc1b311e581352bcdbd";

const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

export const getBalanceERC20 = async (
  contractAddress: string,
  walletAddress: string
): Promise<string | undefined> => {
  try {
    const contract = new Web3Client.eth.Contract(abiData, contractAddress);

    const result = await contract.methods.balanceOf(walletAddress).call({});

    const format = Web3Client.utils.fromWei(result);

    return format;
  } catch (e: any) {
    LoggerService.error(`[getBalanceERC20] -- err: ${e.toString()}`);
    return "0";
  }
};
