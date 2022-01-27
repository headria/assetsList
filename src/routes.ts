import {
  TokensController,
  EthereumController,
  BitcoinController,
  SmartchainController,
  ArabCoinController,
  NofiticationService,
} from "./controllers";
import { Router } from "express";
const router = Router();

router.get("/getList", TokensController.getList);
router.get("/getPriceList1H", TokensController.getPriceList1H);
router.get("/getsupported", TokensController.getSupprotedTokens);
router.get("/tokeninfo", TokensController.getTokenInfo);
router.get("/chartdata", TokensController.getChartData);
router.get("/searchToken", TokensController.searchToken);
router.get("/bitcoin/balance", BitcoinController.getBalance);
router.get("/bitcoin/trxlist", BitcoinController.getTrxLists);
router.get("/bitcoin/getutxos", BitcoinController.getUTXOs);
router.get("/ethereum/watchaccount", EthereumController.watchAccount);
router.get("/ethereum/getlisttx", EthereumController.getAllTx);
router.get("/ethereum/balanceoferc20", EthereumController.getBalanceERC20);
router.get("/smartchain/balanceofbep20", SmartchainController.getBalanceBEP20);
router.get("/smartchain/getlisttx", SmartchainController.getAllTx);
router.get("/arabcoin/getprice", ArabCoinController.getPrice);
router.delete("/notifications/remove", NofiticationService.removeDevice);
router.post("/notifications/new", NofiticationService.addNewDevice);
router.get("/notifications/status", NofiticationService.checkStatusNotif);
export default router;
