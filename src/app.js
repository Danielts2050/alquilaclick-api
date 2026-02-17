import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rutas
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
// Test
app.get('/', (req, res) => {
  res.send('API AlquilaClick funcionando 🚀');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
