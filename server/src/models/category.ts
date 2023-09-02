import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true},
    
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory"
    }],
    subCategoryNames: [{
        type: String,
        // ref: "SubCategory"
    }],
})

categorySchema.pre("save", async function (next) {
    try {
      if (this.isModified("subCategories")) {
        const SubCategory = mongoose.model("SubCategory");
        const subCategories = await SubCategory.find({
          _id: { $in: this.subCategories }
        });
        this.subCategoryNames = subCategories.map(subCategory => subCategory.name);
      }
      next();
    } catch (error) {
      next((error as any));
    }
  });

const categoryModel = mongoose.model("Category", categorySchema)

export default categoryModel