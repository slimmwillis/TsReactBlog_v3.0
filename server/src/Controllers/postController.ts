import PostModel from "../models/postModel";
import categoryModel from "../models/category";
import subCategoryModel from "../models/subcategory";

//create post
export const createPost = async (req: any, res: any) => {
  try {
    const { title, body, category, subCategory, image } = req.body;
    const categoryObject = await categoryModel.findOne({ name: category });
    const subCategoryObject = await subCategoryModel.findOne({
      name: subCategory,
    });
    let post = await PostModel.findOne({ title });

    // SENDING ERRORS MORE CLEARLY -

    if (post) return res.status(400).json("Title already exists!");

    if (!title) return res.status(400).json("Please enter a title");

    if (!body) return res.status(400).json("Please enter a body");

    if (!category) return res.status(400).json("Please select a category");

    if (!subCategory)
      return res.status(400).json("Please select a subcategory");
    post = new PostModel({
      title,
      body,
      category: categoryObject?._id,

      subCategory: subCategoryObject?._id,
      categoryName: categoryObject?.name, // Replace with actual category name
      subCategoryName: subCategoryObject?.name,
      image,
    });
    await post.save();

    res.status(200).json({ _id: post._id, title, body, category, subCategory });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//findPost

export const findPost = async (req: any, res: any) => {
  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//get all posts

export const getPosts = async (req: any, res: any) => {
  try {
    const post = await PostModel.find();
    res.status(200).json(post);
  } catch (error) {
    error: error;
  }
};
//get post(s) by category

export const getPostsByCategory = async (req: any, res: any) => {
  try {
    const posts = await PostModel.find({
      category: req.params.categoryId,
      subCategory: req.params.subCategoryId,
    });
    res.status(200).json(posts);
  } catch (error) {}
};

//delete the post

export const deletePost = async (req: any, res: any) => {
  try {
    const postId = req.params.id; // Use the correct parameter name
    const post = await PostModel.findByIdAndDelete(postId);
    // Delete associated subcategories

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//edit the post

// Update an existing post
export const updatePost = async (req: any, res: any) => {
  try {
    const postId = req.params.id;

    const { categoryName, subCategoryName } = req.body;
    const categoryObject = await categoryModel.findOne({ name: categoryName });
    const subCategoryObject = await subCategoryModel.findOne({
      name: subCategoryName,
    });
    const newPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          ...req.body,
          category: categoryObject?._id,
          subCategory: subCategoryObject?._id,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "an error has occured with editing post" });
  }
};

// change functions to export
