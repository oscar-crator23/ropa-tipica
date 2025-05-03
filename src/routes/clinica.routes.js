import { Router } from 'express';
import { getClinica } from '../controllers/clinica.controller.js';

const router = Router();

router.get('', getClinica);
// router.get('/clinica/:id', getClinica);

export default router;

// router.get('/clinica', (req, res) => {
//     res.send('clinica');
// });