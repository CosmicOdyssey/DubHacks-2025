import { Router } from 'express';
import policyRouter from './policy';
import webhooksRouter from './webhooks';
import uiRouter from './ui';
import adminRouter from './admin';
import syncRouter from './sync';

const router = Router();

router.use('/policy', policyRouter);
router.use('/webhooks', webhooksRouter);
router.use('/ui', uiRouter);
router.use('/admin', adminRouter);
router.use('/sync', syncRouter);

export default router;


