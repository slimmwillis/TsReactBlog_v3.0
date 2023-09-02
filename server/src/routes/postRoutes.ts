import express from "express";
import PostModel from "../models/postModel";
import {
  createPost,
  findPost,
  getPosts,
  deletePost,
  getPostsByCategory,
  updatePost,
} from "../Controllers/postController";


const postRouter = express.Router();

// Route to handle creating a new post



// router.post("/api/createPost", async (req, res) => {
//   try {
//     const { title, body, category, subCategory } = req.body;
//     const newPost = new PostModel({ title, body, category, subCategory });
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

postRouter.get("/posts", getPosts);
postRouter.get("/post/:id", findPost)
postRouter.post("/createPost", createPost)
postRouter.delete("/deletePost/:id", deletePost )
postRouter.get("/posts/:categoryId/:subCategoryId", getPostsByCategory)
postRouter.put('/post/:id', updatePost);






export default postRouter;