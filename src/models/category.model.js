import db from '../config/db.js';

export const CategoryModel = {

  async create(data) {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [data.name, data.description];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query(`
      SELECT * FROM categories
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  async update(id, data) {
    const query = `
      UPDATE categories SET
        name=$1,
        description=$2
      WHERE id=$3
      RETURNING *;
    `;
    const values = [data.name, data.description, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async softDelete(id) {
    await db.query(
      `UPDATE categories SET status='inactive' WHERE id=$1`,
      [id]
    );
  }

};
