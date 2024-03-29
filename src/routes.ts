import { VideoHelperController } from "./controllers/videoHelper";
import { BobaController } from "./controllers/boba";
import {
  TokensController,
  EthereumController,
  BitcoinController,
  SmartchainController,
  ArabCoinController,
  NofiticationController,
  SettingsController,
  MaticController,
  tronList,
  FantomController,
  ReferralController,
  AssetsController,
} from "./controllers";
import { Router } from "express";
const router = Router();

router.get("/getList", TokensController.getList);
router.get("/getPriceList1H", TokensController.getPriceList1H);
router.get("/getsupported", TokensController.getSupprotedTokens);
router.get("/tokeninfo", TokensController.getTokenInfo);
router.get("/chartdata", TokensController.getChartData);
router.get("/searchToken", TokensController.searchToken);
router.get("/settings/checkforforceupdate", SettingsController.checkForUpdate);
router.get("/bitcoin/balance", BitcoinController.getBalance);
router.get("/bitcoin/trxlist", BitcoinController.getTrxLists);
router.get("/bitcoin/getutxos", BitcoinController.getUTXOs);
router.get("/ethereum/watchaccount", EthereumController.watchAccount);
router.get("/ethereum/getlisttx", EthereumController.getAllTx);
router.get("/ethereum/balanceoferc20", EthereumController.getBalanceERC20);
router.get("/smartchain/balanceofbep20", SmartchainController.getBalanceBEP20);
router.get("/smartchain/getlisttx", SmartchainController.getAllTx);

router.get("/fantom/balanceoffantom20", FantomController.getBalanceBEP20);
router.get("/fantom/getlisttx", FantomController.getAllTx);

router.get("/boba/balanceofboba20", BobaController.getBoba20);
router.get("/boba/getlisttx", BobaController.getAllTx);

router.get("/referral/balance", ReferralController.getBalanceByAddress);
router.get("/referral/getrefcode", ReferralController.getReferralByAddress);
router.post("/referral/new", ReferralController.addNew);
router.post("/referral/updatepercentage", ReferralController.updatePercentage);
router.get("/referral/checkrefcode", ReferralController.checkRefCode);
router.get("/referral/claimrequest", ReferralController.newClaim);
router.get(
  "/referral/getlaststatusclaim",
  ReferralController.getLastStatusClaim
);

router.get("/matic/getlisttx", MaticController.getAllTx);
router.get("/arabcoin/getprice", ArabCoinController.getPrice);
router.delete("/notifications/remove", NofiticationController.removeDevice);
router.get("/notifications/sendtest", NofiticationController.sendNotifTest);
router.post("/notifications/new", NofiticationController.addNewDevice);
router.get("/notifications/status", NofiticationController.checkStatusNotif);
router.get("/arabcoin/getprice", ArabCoinController.getPrice);
router.get(
  "/arabcoin/getsuccesslist",
  ArabCoinController.getSuccessTransactions
);
router.post("/arabcoin/buy", ArabCoinController.newRequest);
router.get("/arabcoin/checkamount", ArabCoinController.checkAmount);
router.get(
  "/arabcoin/getbalanceperaccount",
  ArabCoinController.getTotalBalancePerAccount
);
router.get("/arabcoin/gettotalbalance", ArabCoinController.getTotalBalance);
router.get("/arabcoin/gettransactions", ArabCoinController.getTransactions);
router.get("/test/tron", tronList);

router.get("/video/gethelp", VideoHelperController.getVideo);

router.get("/assets/getasset", AssetsController.getTokenByContractAddress);

export default router;
