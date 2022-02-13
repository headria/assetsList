import cron from "node-cron";
import { ArabCoinService } from "..";
import { ArabCoin } from "../../interfaces/arabcoin";
import { BinanceTransactionResult } from "../../interfaces/binancechain";
import { LoggerService } from "../../logger";
import { convertToUnit } from "../../utils/convert";
import getReqeust from "./callApi";

/**
 *
 * Validate transaction by check the transaction data that recoreded on our db and blockchain db.
 * @param tr Transaction data of order for arabcoin
 * @returns
 */
export const validateBinanceTransaction = async (
  tr: ArabCoin
): Promise<{
  status: boolean;
  reason: string;
}> => {
  try {
    const request: any = await getReqeust(`txs/${tr.hash}`)();

    const data: BinanceTransactionResult = request as BinanceTransactionResult;

    console.log(data);
    if (!data)
      return {
        status: false,
        reason: "Transaction status is fialed -- " + tr.check_count + 1,
      };

    const totalTr: number = data.amount;

    const checkAmount: boolean = parseInt(tr.amount_network) <= totalTr;

    const checkAddresses: boolean =
      data.toAddr.toLowerCase() === tr.to.toLowerCase() &&
      data.fromAddr.toLowerCase() === tr.from.toLowerCase();

    if (checkAmount && checkAddresses) {
      return {
        status: true,
        reason: "",
      };
    }
    return {
      status: false,
      reason: "Transaction is fialed -- " + tr.check_count + 1,
    };
  } catch (e: any) {
    LoggerService.error(`[validateBinanceTransaction] err: ${e.toString()}`);

    return {
      status: false,
      reason: e.toString() + " " + tr.check_count + 1,
    };
  }
};

export const validatBinanceChainTransactions = async () => {
  try {
    console.log("[BNB] validation is start");
    const trxList = await ArabCoinService.getUnconfirmedTransactions("BNB");

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
      `[validatBinanceChainTransactions] err: ${e.toString()}`
    );
  }
};

export const BNBCronJob = async () => {
  LoggerService.info("Bitcoin cron job is started... ");

  cron.schedule("*/2 * * * *", () => validatBinanceChainTransactions());
};
