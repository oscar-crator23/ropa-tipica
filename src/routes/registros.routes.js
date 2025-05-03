import { Router } from "express";
import {getAllproductos} from "../controllers/registroscontroller.js";

const router = Router();
router.get('/all', getAllproductos);

export default router;