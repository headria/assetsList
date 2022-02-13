import { TrxResult } from "../../interfaces/bitcoin";
import { ArabCoinService } from "../arabcoin";
import getReuqest from "./callApi";
import cron from "node-cron";
import { ArabCoin } from "../../interfaces/arabcoin";
import { convertToUnit } from "../../utils/convert";
import { LoggerService } from "../../logger";

export const getBalance = async (address: string): Promise<number> => {
  try {
    const request: any = await getReuqest(`addrs/${address}`)();
    return Number.parseFloat(request?.balance || 0);
  } catch {
    return 0;
  }
};

export const getTransactionsList = async (address: string): Promise<any> => {
  try {
    const request: any = await getReuqest(`addrs/${address}/full`)({
      limit: 10,
    });
    return request;
  } catch {
    return 0;
  }
};

export const getUTXOs = async (address: string): Promise<any> => {
  try {
    const request: any = await getReuqest(`addrs/${address}`)({
      unspentOnly: true,
      includeScript: true,
    });
    return request;
  } catch {
    return 0;
  }
};

/**
 *
 * Validate transaction by check the transaction data that recoreded on our db and blockchain db.
 * @param tr Transaction data of order for arabcoin
 * @returns
 */
export const validateTransaction = async (
  tr: ArabCoin
): Promise<{
  status: boolean;
  reason: string;
}> => {
  try {
    const request: any = await getReuqest(`txs/${tr.hash}`)();

    const data: TrxResult = request as TrxResult;

    console.log(data);
    if (!data.confirmed)
      return {
        status: false,
        reason: "Transaction status is fialed -- " + tr.check_count + 1,
      };

    const totalTr: number = data.total + data.fees + 2000;

    const convertedTotal: number = parseInt(
      convertToUnit(tr.amount_network, "BTC", true)
    );
    const checkAmount: boolean = convertedTotal <= totalTr;

    const checkFromAddress: boolean =
      data.addresses.findIndex((addr) => addr.includes(tr.from)) > -1;

    const checkToAddress: boolean =
      data.addresses.findIndex((addr) => addr.includes(tr.to)) > -1;

    if (checkAmount && checkFromAddress && checkToAddress) {
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
    LoggerService.error(`[validateBitcoinTransactions] err: ${e.toString()}`);

    return {
      status: false,
      reason: e.toString() + " " + tr.check_count + 1,
    };
  }
};

export const validateBitcoinTransactions = async () => {
  try {
    console.log("validation is start");
    const trxList = await ArabCoinService.getUnconfirmedTransactions("BTC");

    console.log(trxList);
    trxList.forEach(async (tr: ArabCoin) => {
      const checkValidation = await validateTransaction(tr);
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

export const bitcoinCronjob = async () => {
  LoggerService.info("Bitcoin cron job is started... ");

  cron.schedule("*/10 * * * *", () => validateBitcoinTransactions());
};
