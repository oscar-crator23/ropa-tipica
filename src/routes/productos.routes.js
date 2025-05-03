import { Router } from "express";
import {getAllproductos} from "../controllers/productoscontroller.js";

const router = Router();
router.get('/all', getAllproductos);

export default router;