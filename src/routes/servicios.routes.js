import { Router } from "express";
import {getApiservicios} from "../controllers/servicioscontroller.js";

const router = Router();
router.get('/servicio', getApiservicios);

export default router;