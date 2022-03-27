import cron from "node-cron";
import { ArabCoinService } from "..";
import { ArabCoin } from "../../interfaces/arabcoin";
import {
  Trc20TransactionResult,
  TronTransactionResult,
} from "../../interfaces/tron";
import { LoggerService } from "../../logger";
import { addressesBlockchain, tronTokens } from "../../utils/addresses";
import getReqeust from "./callApi";
import Redis from "../../thirdparty/redis";

/**
 * We will check our address and save them on the redis db.
 */

const baseApi = "https://api.trongrid.io/v1/accounts";

// /**
//  *
//  * Validate transaction by check the transaction data that recoreded on our db and blockchain db.
//  * @param tr Transaction data of order for arabcoin
//  * @returns
//  */
// export const validateBinanceTransaction = async (
//   tr: ArabCoin
// ): Promise<{
//   status: boolean;
//   reason: string;
// }> => {
//   try {
//     const request: any = await getReqeust(`gettransactionbyid`)({
//       value: tr.hash,
//     });

//     const data: TronTransactionResult = request as TronTransactionResult;

//     console.log(data);
//     if (!data)
//       return {
//         status: false,
//         reason: "Transaction status is fialed -- " + tr.check_count + 1,
//       };

//     const totaltron: number =
//       data.raw_data?.contract[0]?.parameter?.value?.amount;

//     const checkAmount: boolean = parseInt(tr.amount_network) <= totaltron;

//     const checkAddresses: boolean =
//       data.toAddr.toLowerCase() === tr.to.toLowerCase() &&
//       data.fromAddr.toLowerCase() === tr.from.toLowerCase();

//     if (checkAmount && checkAddresses) {
//       return {
//         status: true,
//         reason: "",
//       };
//     }
//     return {
//       status: false,
//       reason: "Transaction is fialed -- " + tr.check_count + 1,
//     };
//   } catch (e: any) {
//     LoggerService.error(`[validateBinanceTransaction] err: ${e.toString()}`);

//     return {
//       status: false,
//       reason: e.toString() + " " + tr.check_count + 1,
//     };
//   }
// };

export const validatBinanceChainTransactions = async () => {
  try {
    console.log("[TRX] validation is start");
    const trxList = await ArabCoinService.getUnconfirmedTransactions("TRX");

    trxList.forEach(async (tr: ArabCoin) => {
      const checkValidation = await validateBinanceTransaction(tr);
      await ArabCoinService.updateTransactionStatus(
        tr.hash,
        checkValidation.status,
        checkValidation.reason,

        tr.check_count || 0
      );
    });
  } catch (e: any) {
    LoggerService.error(
      `[TRX-validatBinanceChainTransactions] err: ${e.toString()}`
    );
  }
};

export const BNBCronJob = async () => {
  LoggerService.info("Bitcoin cron job is started... ");

  cron.schedule("*/2 * * * *", () => validatBinanceChainTransactions());
};

const fetchTransactionsPerAddress = async () => {
  const walletAddress = addressesBlockchain.trx;
  const usdtAddress = tronTokens.usdt;
  const timeout = 30000;

  const walletTrxs: any = await getReqeust(
    "/" + walletAddress + "/transactions",
    timeout,
    baseApi
  )({
    limit: 100,
  });

  const tronListTrx: TronTransactionResult[] =
    walletTrxs.data as TronTransactionResult[];

  const query = {
    only_confirmed: "true",
    contract_address: usdtAddress,
    limit: 100,
  };
  const tokenTrxs: any = await getReqeust(
    "/" + walletAddress + "/transactions/trc20",
    timeout,
    baseApi
  )(query);

  const trc20ListTrx: Trc20TransactionResult[] =
    tokenTrxs.data as Trc20TransactionResult[];
};
