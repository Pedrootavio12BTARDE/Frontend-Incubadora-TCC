import { Router } from 'express';
import sensors from './sensors';
import actuators from './actuators';
import production from './production';
import auth from './auth';
import reports from './reports';

const router = Router();

router.use('/sensors', sensors);
router.use('/actuators', actuators);
router.use('/production', production);
router.use('/auth', auth);
router.use('/reports', reports);

router.get('/status', (req, res) => res.json({ ok: true }));

export default router;
