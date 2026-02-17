import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

export class AuthController {

  static async register(req, res) {
    try {
      const { email, password, name, direction, phone_number } = req.body;

       if (!email || !password || !name) {
        return res.status(400).json({
          message: 'Email, password y name son obligatorios'
        });
      }

      const exists = await UserModel.findByEmail(email);
      if (exists) {
        return res.status(400).json({ message: 'El email ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.createLocal({
        email,
        password: hashedPassword,
        name,
        direction,
        phone_number
      });

      res.status(201).json({ message: 'Usuario creado', user });

    } catch (error) {
  console.error(error);
  res.status(500).json({
    message: 'Error al registrar',
    error: error.message
  });
}

  }

static async login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);

    // ✅ Validar existencia primero
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // ✅ Validar password
    if (!user.password) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // ✅ Validar status
    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Usuario inactivo o bloqueado'
      });
    }

    // ✅ Comparar password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // ✅ Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        direction: user.direction,
        phone_number: user.phone_number,
        google_id: user.google_id,
        facebook_id: user.facebook_id,
        rol: user.rol_name,
        rol_id: user.rol_id,
        status: user.status,
        created_at: user.created_at
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en login', error });
  }
}


  // 🔹 Actualizar usuario
static async updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, name, direction, phone_number, password, rol_id, status } = req.body;

    let hashedPassword = null;

    // Si envían password nueva → hashear
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await UserModel.update(id, {
      email,
      name,
      direction,
      phone_number,
      password: hashedPassword,
      rol_id,
      status
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando usuario', error: error.message });
  }
}

// 🔹 Desactivar usuario (soft delete)
static async deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id == id) {
      return res.status(400).json({
        message: 'No puedes desactivar tu propio usuario'
      });
    }


    const user = await UserModel.deactivate(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario desactivado correctamente',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al desactivar usuario',
      error: error.message
    });
  }
}

// 🔹 Listar todos los usuarios (solo admin)
static async listUsers(req, res) {
  try {
    const users = await UserModel.findAll();

    res.json({
      total: users.length,
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error listando usuarios',
      error: error.message
    });
  }
}

}
