import { Router } from 'express';
import { getInsercion } from '../controllers/insercion.controller.js';

const router = Router();

router.post('', getInsercion);
// router.get('/clinica/:id', getClinicas);

export default router;

// router.get('/clinica', (req, res) => {
//     res.send('clinica');
// });