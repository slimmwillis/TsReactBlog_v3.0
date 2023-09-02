import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  categoryName: { // Add categoryName field to store the name of the category
    type: String,
  },

});


subCategorySchema.pre("save", async function (next) {
    try {
      if (this.isModified("category")) {
        const Category = mongoose.model("Category");
        const category = await Category.findById(this.category);
        if (category) {
          this.categoryName = category.name; // Update categoryName field
        }
      }
      next();
    } catch (error) {
      next((error as any));
    }
  });
//   subCategorySchema.virtual("categoryName", {
//     ref: "Category",
//     localField: "category",
//     foreignField: "_id",
//     justOne: true, // Assuming each subcategory has only one category
//     autopopulate: true, // Automatically populate the category name
//   })


// subCategorySchema.plugin(require("mongoose-autopopulate"));

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default subCategoryModel;
