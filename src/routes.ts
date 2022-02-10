import {
  TokensController,
  EthereumController,
  BitcoinController,
  SmartchainController,
  ArabCoinController,
  NofiticationController,
  SettingsController,
} from "./controllers";
import { Router } from "express";
const router = Router();

router.get("/getList", TokensController.getList);
router.get("/getPriceList1H", TokensController.getPriceList1H);
router.get("/getsupported", TokensController.getSupprotedTokens);
router.get("/tokeninfo", TokensController.getTokenInfo);
router.get("/chartdata", TokensController.getChartData);
router.get("/searchToken", TokensController.searchToken);
router.get("/seetings/checkforforceupdate", SettingsController.checkForUpdate);
router.get("/bitcoin/balance", BitcoinController.getBalance);
router.get("/bitcoin/trxlist", BitcoinController.getTrxLists);
router.get("/bitcoin/getutxos", BitcoinController.getUTXOs);
router.get("/ethereum/watchaccount", EthereumController.watchAccount);
router.get("/ethereum/getlisttx", EthereumController.getAllTx);
router.get("/ethereum/balanceoferc20", EthereumController.getBalanceERC20);
router.get("/smartchain/balanceofbep20", SmartchainController.getBalanceBEP20);
router.get("/smartchain/getlisttx", SmartchainController.getAllTx);
router.get("/arabcoin/getprice", ArabCoinController.getPrice);
router.delete("/notifications/remove", NofiticationController.removeDevice);
router.get("/notifications/sendtest", NofiticationController.sendNotifTest);
router.post("/notifications/new", NofiticationController.addNewDevice);
router.get("/notifications/status", NofiticationController.checkStatusNotif);
router.get("/arabcoin/getprice", ArabCoinController.getPrice);
router.post("/arabcoin/buy", ArabCoinController.newRequest);
router.get("/arabcoin/checkamount", ArabCoinController.checkAmount);
router.get(
  "/arabcoin/getbalanceperaccount",
  ArabCoinController.getTotalBalancePerAccount
);
router.get("/arabcoin/gettotalbalance", ArabCoinController.getTotalBalance);

export default router;
