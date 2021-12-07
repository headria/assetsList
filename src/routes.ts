import { TokensController } from "./controllers";
import { Router } from "express";
const router = Router();

router.get("/getList", TokensController.getList);
router.get("/searchToken", TokensController.searchToken);
export default router;
