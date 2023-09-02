import { Request, Response } from "express";
import categoryModel from "../models/category";
import subCategoryModel from "../models/subcategory";
import PostModel from "../models/postModel";
import mongoose from "mongoose";


export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    let category = await categoryModel.findOne({ name });

    if (category) return res.status(400).json("category already exists...");

    if (!name) return res.status(400).json("All fields are required...");

    category = new categoryModel({ name });
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel
      .findOne({
        name: req.params.categoryName,
      })
      .populate("subCategories");

    if (!category)
      return res.status(404).json({ message: "Category does not exists" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id; // Use the correct parameter name
    const category = await categoryModel.findByIdAndDelete(categoryId);
    // Delete associated subcategories
    await subCategoryModel.deleteMany({ category: categoryId });
    await PostModel.deleteMany({ category: categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategoryName = async (req: Request, res: Response) => {
  try {
    const { previousName, newName } = req.body;

    // Update category name
    const existingCategoryWithNewName = await categoryModel.findOne({ name: newName });
    if (existingCategoryWithNewName) {
      return res.status(400).json({ success: false, error: "Category name already exists" });
    }
    const updatedCategory = await categoryModel.findOneAndUpdate(
      { name: previousName },
      { $set: { name: newName } },
      { new: true }
    );

    // Update subcategory names
    await subCategoryModel.updateMany(
      { categoryName: previousName },
      { $set: { categoryName: newName } }
    );

    res.json({
      success: true,
      updatedCategory,
      message: "Names updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "something went wrong" });
  }
}

export const updateSubCategoryName = async (req: Request, res: Response) => {
  try {
    const { categoryName, newName, previousName } = req.body;

    const category = await categoryModel.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategoryIndex = category.subCategoryNames.indexOf(previousName);
    if (subCategoryIndex === -1) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Check if the new name already exists in subCategoryNames
    if (category.subCategoryNames.includes(newName)) {
      return res.status(400).json({ message: 'New name already exists' });
    }

    category.subCategoryNames[subCategoryIndex] = newName;
    await category.save();

    const subCategory = await subCategoryModel.findOne({
      category: category._id,
      name: previousName,
    });
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subCategory.name = newName;
    await subCategory.save();

    return res.json({ message: 'Subcategory updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
