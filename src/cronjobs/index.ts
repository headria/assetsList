import { LoggerService } from "../logger";
import { EtherService } from "../services";
import { bitcoinServices } from "../services/bitcoin";

export const cronJobs = async () => {
  bitcoinServices.bitcoinCronjob();
  EtherService.transactions.BSCCronJob();
  EtherService.transactions.EthCronJob();
  EtherService.transactions.MaticCronJob();
};
