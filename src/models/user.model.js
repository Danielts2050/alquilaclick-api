import pool from '../config/db.js';

export class UserModel {

static async createLocal(user) {
  const query = `
    INSERT INTO users (email, password, name, direction, phone_number, rol_id)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

  const values = [
    user.email,
    user.password,
    user.name,
    user.direction,
    user.phone_number,
    user.rol_id || 2
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}


  static async createSocial(user) {
  const query = `
    INSERT INTO users (email, name, google_id, facebook_id, rol_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    user.email,
    user.name,
    user.google_id || null,
    user.facebook_id || null,
    user.rol_id || 2
  ]);

  return rows[0];
}


  static async findByEmail(email) {
    const { rows } = await pool.query(
    `SELECT u.*, r.name as rol_name 
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.email = $1`,
    [email]
  );
  return rows[0];
  }

static async findByGoogleId(id) {
  const { rows } = await pool.query(
    `SELECT u.*, r.name as rol_name 
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.google_id = $1`,
    [id]
  );
  return rows[0];
}


  static async update(id, data) {
  const query = `
    UPDATE users
    SET
      email = COALESCE($1, email),
      name = COALESCE($2, name),
      direction = COALESCE($3, direction),
      phone_number = COALESCE($4, phone_number),
      password = COALESCE($5, password),
      rol_id = COALESCE($6, rol_id),
      status = COALESCE($7, status)
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    data.email || null,
    data.name || null,
    data.direction || null,
    data.phone_number || null,
    data.password || null,
    data.rol_id || null,
    data.status || null,
    id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

static async deactivate(id) {
  const query = `
    UPDATE users
    SET status = 'inactive'
    WHERE id = $1
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

static async findAll() {
  const query = `
    SELECT 
      u.id,
      u.email,
      u.name,
      u.direction,
      u.phone_number,
      u.google_id,
      u.facebook_id,
      u.status,
      u.created_at,
      r.name AS rol_name
    FROM users u
    LEFT JOIN roles r ON r.id = u.rol_id
    ORDER BY u.id DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
}


}
