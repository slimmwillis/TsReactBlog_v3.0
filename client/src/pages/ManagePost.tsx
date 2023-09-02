import React, { useEffect, useState, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for ReactQuill
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ErrorType, Post } from "../types/types";
import CircularProgress from "@mui/material/CircularProgress";

interface Category {
  _id: string;
  name: string;
  subCategories: string[];
  subCategoryNames: string[];
}

interface FormData {
  _id: string;
  title: string;
  body: string;
  category: string;
  subCategory: string;
}

const ManagePost: React.FC = () => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);

  const quillObj = useRef<ReactQuill | null>();
  const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode
  const [editPostId, setEditPostId] = useState<string | null>(null); // Post ID for editing
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >("");

  const [formData, setFormData] = useState<any>({
    _id: "",
    title: "",
    body: "",
    category: "",
    subCategory: "",
  });
  const [isCategoryChanged, setIsCategoryChanged] = useState<Boolean>(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]); // Assuming you have a Post type
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  useEffect(() => {
    fetchCategories();
    fetchPosts(); // Fetch existing posts
    if (postId) {
      enterEditMode(postId);
    }
  }, [postId]); // Include isEditMode in the dependency array

  const enterEditMode = async (postId: string) => {
    setIsEditMode(true);
    setEditPostId(postId);

    try {
      setLoading(true);

      const response = await axios.get(`/api/post/${postId}`); // Adjust the endpoint
      const postData: any = response.data;
      setSelectedCategory(postData?.categoryName);
      setSelectedSubCategory(postData?.subCategoryName);
      setImage(postData?.image ?? "");
      setFormData({
        ...postData,
        category: postData.category, // Ensure the correct field name
        subCategory: postData.subCategory, // Ensure the correct field name
      });
      setImageFile(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event?.target?.value;
    setSelectedCategory(category);
    setSelectedSubCategory("");
    setIsCategoryChanged(true);
    setFormData((prevData: any) => ({
      ...prevData,
      category: category,
      subCategory: "",
    }));
  };

  const handlesubCategoryChange = (event: SelectChangeEvent<string>) => {
    const subCategoryName = event?.target?.value;
    setSelectedSubCategory(subCategoryName);

    try {
      // Find the corresponding subcategory in the selected category's subCategories array
      const selectedCategoryObject = categories.find(
        (category) => category.name === selectedCategory
      );

      if (!selectedCategoryObject) {
        throw new Error("Selected category not found.");
      }

      const isSubCategoryValid =
        selectedCategoryObject.subCategoryNames.includes(subCategoryName);

      if (!isSubCategoryValid) {
        throw new Error(
          "Selected subcategory not found in the selected category."
        );
      }

      // Find the corresponding subcategory name in the selected category's subCategoryNames array

      const selectedSubCategoryName =
        selectedCategoryObject.subCategoryNames.find(
          (subCategory) => subCategory === subCategoryName
        );

      if (!selectedSubCategoryName) {
        throw new Error(
          "Selected subcategory not found in the selected category."
        );
      }

      // Since the subCategoryName is valid, we can set it directly in the formData
      setFormData((prevData: any) => ({
        ...prevData,
        subCategory: selectedSubCategoryName,
      }));
    } catch (error) {
      console.error("Error handling subcategory change:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (formData.title === "") throw new Error("Please enter a title");
      if (formData.body === "") throw new Error("Please enter a body");
      let cloudinaryRes: any = false;
      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile!);
        form.append("upload_preset", "blogPosts");
        setLoading(true);

        cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/wbailey89/upload",
          form
        );
      }
      setLoading(false);
      setLoading(true);

      let data = {
        body: formData?.body,
        categoryName: !isCategoryChanged
          ? formData?.categoryName
          : formData?.category,
        image: formData?.image,
        subCategoryName: !isCategoryChanged
          ? formData?.subCategoryName
          : formData?.subCategory,
        title: formData?.title,
      };

      // return
      await axios.put(`/api/post/${editPostId}`, {
        ...data,
        ...(cloudinaryRes !== false && {
          image: cloudinaryRes?.data?.secure_url,
        }),
      });
      setLoading(false);

      toast.success("Post updated successfully");
      // setIsEditMode(false) // Exit edit mode
      // setEditPostId(null)
      // setFormData({
      //   _id: "",
      //   title: "",
      //   body: "",
      //   category: "",
      //   subCategory: ""
      // }) // Clear the form
    } catch (err) {
      setLoading(false);

      const error = err as ErrorType;
      toast.error(error?.response?.data || error?.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleQuillChange = (
    value: string,
    delta: any,
    source: any,
    editor: any
  ) => {
    setFormData((prevData: any) => ({ ...prevData, body: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let postData: any = {
      ...formData,
    };
    // Handle form submission or API calls with the form data
    try {
      // ADDED IMAGE VALIDATION -
      if (!imageFile) throw new Error("Please upload an image");
      if (postData?.title.length < 3)
        throw new Error("Please add title more than 2 characters");

      const formData = new FormData();
      formData.append("file", imageFile!);
      formData.append("upload_preset", "blogPosts");
      setLoading(true); //

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/wbailey89/upload",
        formData
      );
      setLoading(false); //

      postData = {
        ...postData,
        image: cloudinaryRes.data.secure_url,
      };
      setLoading(true); //

      await axios.post(`/api/createPost`, postData);
      setLoading(false); //

      toast.success("Post is created successfully");
      setFormData({
        _id: "",
        title: "",
        body: "",
        category: "",
        subCategory: "",
      }); // Clear the form after successful submission
      setSelectedSubCategory("");
      setSelectedCategory("");
      setImage(undefined);
    } catch (err) {
      // WORKED ON ERROR HANDLING -
      const error = err as ErrorType;
      setLoading(false); //

      toast.error(error?.response?.data || error?.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/categories");
      setCategories(response.data);
      setLoading(false); // Stop loading
    } catch (error) {
      setLoading(false); // Stop loading

      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true); // Stop loading
      const response = await axios.get("/api/posts"); // Update the endpoint
      setPosts(response.data);
      setImageFile(null);
      setLoading(false); // Stop loading
    } catch (error) {
      setLoading(false); // Stop loading

      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const pickImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // source of the image to show it
      setImage(reader.result as string);
      setImageFile(file);
    };
  };

  const uploadQuillImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "blogPosts");
    setLoading(true); // Stop loading
    const cloudinaryRes = await axios.post(
      "https://api.cloudinary.com/v1_1/wbailey89/upload",
      formData
    );
    setLoading(false); // Stop loading

    return cloudinaryRes.data.secure_url;
  };

  const quillImageHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      var file: any = input.files?.[0];
      var formData = new FormData();

      formData.append("image", file);

      var fileName = file.name;

      // const res = await this.uploadFiles(file, fileName, quillObj)
    };
  };
  // USING MEMO TO AVOID RECREATING THE MODULES
  const modules = useMemo(() => {
    return {
      clipboard: {
        matchVisual: false,
      },
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
          [{ color: [] }],
        ],
        handlers: {
          // CUSTOM HANDLER FOR UPLOADING IMAGES USING REACT QUILL
          image: () => {
            // CREATING A FILE INPUT
            const input = document.createElement("input");

            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            // CLICKING ON IT TO OPEN THE FILE PICKER
            input.click();

            // WHEN WE PICK THE FILE
            input.onchange = async () => {
              var file: File | undefined = input.files?.[0];
              if (!file) return;

              // UPLOAD FILE TO CLOUDINARY
              const url = await uploadQuillImage(file);

              // INSERTING THE IMAGE TO THE EDITOR
              const range = quillObj!.current!.getEditorSelection();
              quillObj!
                .current!?.getEditor()
                .insertEmbed(range!.index, "image", url);
            };
          },
        },
      },
    };
  }, []);

  // USING MEMO TO AVOID RECREATING THE FORMATS
  const formats = useMemo(() => {
    return [
      "header",
      "bold",
      "italic",
      "underline",
      "list",
      "bullet",
      "align",
      "link",
      "image",
      "color",
    ];
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <form onSubmit={isEditMode ? handleEditSubmit : handleSubmit}>
          <Box
            width="100%"
            height="300px"
            mb={2}
            bgcolor="silver"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {!image && <Typography>Upload an image to show here!</Typography>}
            {image && (
              <img
                src={image}
                alt="Cover"
                style={{
                  marginTop: 10,
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            )}
          </Box>

          {/* USING THE BUTTON TO UPLOAD IMAGES -   */}

          <Button
            component="label"
            htmlFor="addCoverImage"
            variant="outlined"
            fullWidth
          >
            Upload Cover Image
          </Button>
          <input
            hidden
            id="addCoverImage"
            type="file"
            accept="image/*"
            onChange={pickImage}
          />

          {/* Title input */}
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ marginBottom: "16px", marginTop: "16px" }}
          />

          {/* ReactQuill editor */}
          <ReactQuill
            value={formData.body}
            placeholder="Description"
            style={{ height: 140 }}
            onChange={handleQuillChange}
            modules={modules}
            formats={formats}
            ref={quillObj as any}
          />
          <FormControl
            fullWidth
            style={{ marginTop: window.innerWidth < 632 ? 80 : 60 }}
          >
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
              label="Category"
              name="category"
            >
              {categories &&
                categories.length > 0 &&
                categories.map((category) => (
                  <MenuItem
                    key={category?.name || ""}
                    value={category?.name || ""}
                  >
                    {category?.name || ""}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {selectedCategory && (
            <FormControl fullWidth style={{ marginTop: 10 }}>
              <InputLabel id="subCategory-label">subCategory</InputLabel>
              <Select
                labelId="subCategory-label"
                id="subCategory-select"
                value={selectedSubCategory}
                onChange={handlesubCategoryChange}
                label="subCategory"
                name="subCategory"
              >
                {categories
                  .find((category) => category?.name === selectedCategory)
                  ?.subCategoryNames?.map((subCategoryName) => (
                    <MenuItem key={subCategoryName} value={subCategoryName}>
                      {subCategoryName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          {/* Submit button */}
          <Button type="submit" variant="contained" style={{ marginTop: 20 }}>
            {isEditMode ? "Save Changes" : "Post"}
          </Button>
        </form>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.7)",
              zIndex: 9999, // Adjust the z-index as needed
            }}
          >
            <CircularProgress size={40} /> {/* Adjust size as needed */}
          </div>
        )}
      </Box>
    </>
  );
};

export default ManagePost;
