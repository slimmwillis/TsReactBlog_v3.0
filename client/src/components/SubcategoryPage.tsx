import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { styled, createTheme } from "@mui/material/styles";
import { PostListTemplate } from "./PostListTemplate";
import { Post } from "../types/types";
import { AuthContext, AuthContextType } from "../context/AuthContext"

// Create the theme object
const theme = createTheme();

// Styled component for the delete button
const StyledDeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white", // Red background
  color: "black", // White text color
  "&:hover": {
    color: "white",
    backgroundColor: "red" // Darker red background on hover
  },
}));


function SubcategoryPage() {
  const { categoryName, subCategoryName } = useParams<{
    categoryName: string;
    subCategoryName: string;
  }>();
  const [posts, setPosts] = useState<Post[]>([
  ]);
  const [category, setCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const { admin } = useContext(AuthContext) as AuthContextType

  const navigate = useNavigate();

  const handleEditPost = (postId: string) => {
    // Navigate to the edit page for the selected post
    navigate(`/manage/${postId}`);
  };

  const handleOpenDeleteDialog = (postId: string) => {
    setPostIdToDelete(postId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPostIdToDelete("");
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/deletePost/${postIdToDelete}`);
      // Remove the deleted post from the posts array
      setPosts(posts.filter((post) => post._id !== postIdToDelete));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios.get(`/api/categories/${categoryName}`);
      setCategory(res.data);
      const findSubCategory = res.data.subCategories.find(
        (subCat: any) => subCat.name == subCategoryName
      );
      if (!findSubCategory) {
        throw "error";
      }
      setSubCategory(findSubCategory);
      return {
        category: res.data,
        subCategory: findSubCategory,
      };
    } catch (error) {
      navigate("/");
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { category, subCategory } = (await getCategory()) as any;
        const response = await axios.get(
          `/api/posts/${category._id}/${subCategory._id}`
        );
        setPosts(response.data);
      } catch (error) {
        navigate("/");
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, [categoryName, subCategoryName]);

  return (
    <div style={{ marginLeft: 20 }}>
      <h5 style={{ textAlign: "center", display: "flex", justifyContent: "center", fontWeight: "bold", }}>Posts in:{" "} <div style={{ fontWeight: "normal",width: "15%", marginLeft: 1 }}>{" " + subCategoryName && subCategoryName?.toLocaleUpperCase()}</div></h5>
      <PostListTemplate />

      {
        window.innerWidth < 632 ?

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 0.9fr))",
            }}
          >
            {posts.map((post) => (
              <li
                key={post._id}
                className="list-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: 10,
                      marginBottom: "16px",
                    }}
                  />
                </div>
                <div
                  id="list-item-title"
                  onClick={() => navigate(`/post/${post._id}`)}
                  style={{
                    cursor: "pointer",
                    fontSize: "1rem",
                    textAlign: "center",
                    marginBottom: "16px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {post?.title?.toUpperCase()}
                </div>
                {admin && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Button onClick={() => handleEditPost(post._id)}>Edit</Button>
                    <StyledDeleteButton
                      onClick={() => handleOpenDeleteDialog(post._id)}
                    >
                      Delete
                    </StyledDeleteButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
          :


          <ul style={{ listStyle: "none", padding: 0, }}>
            {posts.map((post) => (
              <li
                key={post._id}
                className="list-item"
                style={{ marginRight: window.innerWidth ? 20 : 0 }}
              >
                <div style={{ display: "flex" }} >
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      marginRight: "16px",
                      borderRadius: 10
                    }}
                  />
                  <div
                    id="list-item-title"
                    onClick={() => navigate(`/post/${post._id}`)}
                    style={{ cursor: "pointer", flexGrow: 1, fontSize: 30, marginTop: 24 }}
                  >
                    {post?.title?.toUpperCase()}
                  </div>
                </div>
                {admin && <div style={{ display: "flex" }}>

                  <Button onClick={() => handleEditPost(post._id)}>Edit</Button>

                  <StyledDeleteButton
                    onClick={() => handleOpenDeleteDialog(post._id)}
                  >
                    Delete
                  </StyledDeleteButton>
                </div>}

              </li>
            ))}
          </ul>
      }

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{ sx: { borderRadius: "8px" } }} // Style the paper (dialog container)
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <StyledDeleteButton onClick={handleDeletePost} autoFocus>
            Delete
          </StyledDeleteButton>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default SubcategoryPage;
