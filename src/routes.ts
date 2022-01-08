import {
  TokensController,
  EthereumController,
  BitcoinController,
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
router.get("/ethereum/getlisttx", EthereumController.getAllTx);
router.get("/ethereum/balanceoferc20", EthereumController.getBalanceERC20);
export default router;
