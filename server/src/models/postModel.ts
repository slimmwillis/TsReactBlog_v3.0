import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 120,
        unique: true
    },
    body: {
        type: String,
        required: true,
        // minlength: 3,
        // maxlength: 5000,
        unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory"
    },
    categoryName: String, // Add a field to store category name
    subCategoryName: String, 
    image: String

    
}, {
    timestamps:true
})

const PostModel = mongoose.model("Post", postSchema)

export default PostModel