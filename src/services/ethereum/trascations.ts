import { ArabCoinService } from "..";
import { ArabCoin, ETHNetworkTypes } from "../../interfaces/arabcoin";
import cron from "node-cron";
import callApi, { EthereumChainName, RPCApiCall } from "./callApi";
import { LoggerService } from "../../logger";
import { RPCBody, RPCResult } from "../../interfaces/RPC";
import {
  TransactionResut,
  ETHTransactionStatus,
} from "../../interfaces/eth-networks";
import {
  convertToUnit,
  decodeETHInputDataTransafer,
} from "../../utils/convert";
import Web3 from "web3";

const getRequest = (chain: EthereumChainName) => callApi(chain, 30000);

export const getStatusOfTransaction = async (
  txhash: string,
  chain: EthereumChainName
) => {
  const module = "transaction";
  const action = "gettxreceiptstatus";

  var query = {
    module,
    action,
    txhash,
  };
  const data = await getRequest(chain)(query);

  return data;
};

const getNetworkUrl = (blockchain: ETHNetworkTypes, network: string) => {
  if (blockchain === "ETH")
    return {
      https: `https://eth.getblock.io/${network}/?api_key=2e89aac7-4985-4684-9547-fd4956bbd784`,
    };
  if (blockchain === "BSC")
    return {
      https: `https://bsc.getblock.io/${network}/?api_key=2e89aac7-4985-4684-9547-fd4956bbd784`,
    };
  if (blockchain === "MATIC")
    return {
      https: `https://matic.getblock.io/${network}/?api_key=2e89aac7-4985-4684-9547-fd4956bbd784`,
    };
  return {
    ws: "",
    https: "",
  };
};

export const validateBitcoinTransactions = async (network: ETHNetworkTypes) => {
  try {
    const trxList = await ArabCoinService.getUnconfirmedTransactions(network);
    trxList.forEach(async (tr: ArabCoin) => {
      const checkValidation = await validateTransaction(tr, network);
      await ArabCoinService.updateTransactionStatus(
        tr.hash,
        checkValidation.status,
        checkValidation.reason,

        tr.check_count || 0
      );
    });
  } catch (e: any) {
    LoggerService.error(`[validateBitcoinTransactions] err: ${e.toString()}`);
  }
};

export const validateTransaction = async (
  tr: ArabCoin,
  network: ETHNetworkTypes
): Promise<{
  status: boolean;
  reason: string;
}> => {
  try {
    if (tr.from.toLowerCase() === tr.to.toLowerCase()) {
      return {
        status: false,
        reason: "From and to address are same",
      };
    }
    console.log(`Network ${network.toUpperCase()} is Activited`);
    const getUrls = getNetworkUrl(
      network,
      network === "ETH" ? "rinkeby" : "testnet"
    );

    const body: RPCBody = {
      jsonrpc: "2.0",
      method: "eth_getTransactionByHash",
      params: [tr.hash],
      id: Math.floor(Math.random() * 10),
    };
    const resultRPC = RPCApiCall<RPCResult<TransactionResut>>(
      getUrls.https,
      body
    );

    // TODO - change it for bsc and matic
    const trStatus = getStatusOfTransaction(
      tr.hash,
      network === "ETH" ? "rinkeby" : "bsctestnet"
    );

    const responsePromise = await Promise.all([resultRPC, trStatus]);

    const transactionData: RPCResult<TransactionResut> = responsePromise[0];
    const transactionStatus: ETHTransactionStatus =
      responsePromise[1] as ETHTransactionStatus;

    if (transactionStatus.status !== "1") {
      return {
        status: false,
        reason: "Transaction status is fialed -- " + tr.check_count + 1,
      };
    }

    let convertedValue = convertToUnit(transactionData.result.value, "ETH");
    const arab_network = tr.amount_network;

    // this section is for tokens
    // TODO - test this section
    if (transactionData.result.input.length > 10) {
      const convertInputData = decodeETHInputDataTransafer(
        transactionData.result.input
      );
      convertedValue = convertInputData.amount.toString();
      if (convertedValue !== arab_network) {
        return {
          status: false,
          reason: "Transaction amount is incorrect -- " + tr.check_count + 1,
        };
      }
    } else {
      if (convertedValue !== arab_network) {
        return {
          status: false,
          reason: "Transaction amount is incorrect -- " + tr.check_count + 1,
        };
      }
    }

    if (
      tr.from.toLowerCase() !== transactionData.result.from.toLowerCase() &&
      tr.to.toLowerCase() !== transactionData.result.to.toLowerCase()
    ) {
      return {
        status: false,
        reason: "Transaction addresses is incorrect -- " + tr.check_count + 1,
      };
    }

    return {
      status: true,
      reason: "",
    };
  } catch (e: any) {
    LoggerService.error(`[validateTransaction] err:${e.toString()}`);
    return {
      status: false,
      reason: e.toString() + " " + tr.check_count + 1,
    };
  }
};

export const EthCronJob = async () => {
  cron.schedule("*/3 * * * *", () => validateBitcoinTransactions("ETH"));
};
export const BSCCronJob = async () => {
  cron.schedule("*/3 * * * *", () => validateBitcoinTransactions("BSC"));
};
export const MaticCronJob = async () => {
  cron.schedule("*/3 * * * *", () => validateBitcoinTransactions("MATIC"));
};
