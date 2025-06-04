import { Router } from 'express';
import definitionsController from '@/controllers/definitions.controller';

const router = Router();

router.get('/definitions', definitionsController.getDefinitions);

export default router;
