import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller.js';
import requireAuth from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', requireAuth, requireRole('admin'), AuthController.listUsers);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    
  }
);

router.put('/users/:id', AuthController.updateUser);
router.delete('/users/:id', AuthController.deleteUser);

export default router;
