import express from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import requireAuth from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('admin'), CategoryController.create);
router.get('/', CategoryController.list);
router.get('/:id', CategoryController.get);
router.put('/:id', requireAuth, requireRole('admin'), CategoryController.update);
router.delete('/:id', requireAuth, requireRole('admin'), CategoryController.delete);

export default router;
