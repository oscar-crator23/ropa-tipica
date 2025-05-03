import { Router } from "express";
import {getAllproductos} from "../controllers/usercontroller.js";

const router = Router();
router.get('/all', getAllproductos);

export default router;