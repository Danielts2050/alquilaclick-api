export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // convertir a array si viene un string
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    next();
  };
};
