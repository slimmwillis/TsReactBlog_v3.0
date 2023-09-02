import { Request, Response } from "express";
import subCategoryModel from "../models/subcategory";
import categoryModel from "../models/category";
import PostModel from "../models/postModel";

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    let subCategory = await subCategoryModel.findOne({
      name,
      category: categoryId,
    });

    if (subCategory)
      return res.status(400).json("Sub category already exists...");

    if (!name) return res.status(400).json("All fields are required...");

    subCategory = new subCategoryModel({ name, category: categoryId });
    await subCategory.save();

    const category = await categoryModel.findById(categoryId);
    category?.subCategories.push(subCategory._id);
    await category?.save();

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategoryId = req.params.id; // Use the correct parameter name

    const subCategory = await subCategoryModel.findByIdAndDelete(subCategoryId);

    const category = await categoryModel.findById(subCategory?.category);
    if (!category) {
      throw new Error("Category not found");
    }
    category.subCategories = category.subCategories.filter(
      (id) => id.toString() !== subCategoryId
    );

    // Remove subCategoryName from subCategoryNames array
    const nameIndex = category.subCategoryNames.indexOf(String(subCategory?.categoryName));
    if (nameIndex > -1) {
      category.subCategoryNames.splice(nameIndex, 1);
    }
    await category.save();
    await PostModel.deleteMany({
      subCategory: subCategoryId
    })


    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
