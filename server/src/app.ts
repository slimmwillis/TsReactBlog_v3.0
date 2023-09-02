import dotenv from "dotenv"
dotenv.config()
import express, { application } from "express"
import mongoose from "mongoose"
import subscriberModel from "./models/subscriber"
import cors from "cors"
const bodyParser = require("body-parser")
// import postRoutes from "./routes/postRoutes"; // Import the postRoutes
import categoryModel from "./models/category"
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategoryName,
  updateSubCategoryName
} from "./Controllers/categoryController"
import {
  createSubCategory,
  deleteSubCategory
} from "./Controllers/subCategoryController"
import subCategoryModel from "./models/subcategory"
import postRouter from "./routes/postRoutes" // Import the postRoutes

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

//subscriber controller
app.post("/subscriber", async (req, res) => {
  const subExists = await subscriberModel.findOne(req.body)
  if (subExists) {
    res.status(422).json("Already subscribed, no need to subscribe twice.")
    return
  }

  const subscriber = new subscriberModel(req.body)
  await subscriber.save()
  res.json(subscriber)
})
app.post("/updateCategoryName", updateCategoryName)
app.post("/updateSubCategory", updateSubCategoryName)
app.post("/deleteSubscriber", async (req, res) => {
  try {
    const { emailToDelete } = req.body

    if (!emailToDelete) {
      return res.status(400).json({ error: "Invalid input" })
    }

    // Delete a subscriber based on the provided email address
    const result = await subscriberModel.deleteOne({ email: emailToDelete })

    // Check if any documents were deleted
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Subscriber deleted successfully" })
    } else {
      res.status(404).json({ error: "Subscriber not found to delete" })
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting subscriber" })
  }
})

//blog posts

app.use("/api", postRouter)

// Category routes

app.get("/api/categories", getCategories)
app.post("/api/categories", createCategory)
app.delete("/api/categories/:id", deleteCategory)
app.get("/api/categories/:categoryName", getCategory)
app.post("/api/categories/:categoryId/subcategories", createSubCategory)
app.delete("/api/subcategories/:id", deleteSubCategory)
// mongodb://localhost:27017/TsReactBlogV2_0

// Start the server
const PORT = process.env.PORT || 5500

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("DATABASE CONNECTED")
  app.listen(PORT, () => {
    console.log("SERVER STARTED")
  })
})
