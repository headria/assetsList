import { LoggerService } from "../logger";
import { EtherService } from "../services";
import { BinanceChainService } from "../services/binancechain";
import { bitcoinServices } from "../services/bitcoin";

export const cronJobs = async () => {
  bitcoinServices.bitcoinCronjob();
  BinanceChainService.BNBCronJob();
  EtherService.transactions.BSCCronJob();
  EtherService.transactions.EthCronJob();
  EtherService.transactions.MaticCronJob();
};
