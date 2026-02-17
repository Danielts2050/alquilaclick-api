import { CategoryModel } from '../models/category.model.js';

export const CategoryController = {

  async create(req, res) {
    try {
      const category = await CategoryModel.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async list(req, res) {
    try {
      const categories = await CategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async get(req, res) {
    try {
      const category = await CategoryModel.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Not found' });
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const category = await CategoryModel.update(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await CategoryModel.softDelete(req.params.id);
      res.json({ message: 'Category deactivated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

};
