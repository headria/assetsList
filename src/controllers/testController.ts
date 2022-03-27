import { addressesBlockchain, tronTokens } from "../utils/addresses";
import getReqeust from "../services/tron/callApi";
import {
  Trc20TransactionResult,
  TronTransactionResult,
} from "../interfaces/tron";

export const tronList = async (req: any, res: any) => {
  const baseApi = "https://api.trongrid.io/v1/accounts";
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
  console.log(tronListTrx);
  console.log(tronListTrx.length);

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
  console.log(trc20ListTrx);
  console.log(trc20ListTrx.length);
  return res.send({});
};
