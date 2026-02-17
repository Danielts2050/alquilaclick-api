import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

export default async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol_name,
      status: user.status
    };

    next();

  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}
