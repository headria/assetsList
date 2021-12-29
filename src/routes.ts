import { TokensController, EthereumController } from "./controllers";
import { Router } from "express";
const router = Router();

router.get("/getList", TokensController.getList);
router.get("/getPriceList1H", TokensController.getPriceList1H);
router.get("/searchToken", TokensController.searchToken);
router.get("/ethereum/getlisttx", EthereumController.getAllTx);
export default router;
