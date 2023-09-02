import { useContext, useEffect, useState } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "../assets/style/navMenu.css";
import { useLocation, useNavigate } from "react-router-dom";
import AddCategoryDialog from "./AddCategoryDialog";
import axios from "axios";
import { toast } from "react-hot-toast";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import AutoDeleteRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { FontWeight } from "@cloudinary/url-gen/qualifiers";
import CircularProgress from "@mui/material/CircularProgress";

//updated to use "100%"" instead of 240px
// const drawerWidth = "100%"

const browserWindowWidth = window.innerWidth; // Example, this gets the current window width

// Define a threshold for what you consider a "large screen"
const largeScreenWidthThreshold = 1200; // You can adjust this value

// Calculate the drawer width based on the browser window width
const drawerWidth =
  browserWindowWidth >= largeScreenWidthThreshold
    ? "100%"
    : `${browserWindowWidth}px`;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    width: 200,
    height: "110vh",
    "& .MuiDrawer-paper": {
      width: "100%",
    },
  }),
  ...(!open && {
    overflowX: "hidden",
    height: "100vh",
    transition: "transform 2s ease-in-out, width 2s ease-in-out",
    transform: open ? "none" : "translateX(-6%)",
  }),
}));

const MessageContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  fontSize: "1rem",
  fontWeight: "bold",
  color: "#888",
});

interface Category {
  _id: string;
  name: string;
}

interface Error {
  response: {
    data: string;
  };
}

export default function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { admin } = useContext(AuthContext) as AuthContextType;
  const [loading, setLoading] = useState(false);
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);

  const handleClickOpenAddCategoryDialog = () => {
    setOpenAddCategoryDialog(true);
  };

  const handleClose = () => {
    setOpenAddCategoryDialog(false);
    setEditCategory(null);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  async function addCategory(name: string) {
    try {
      setLoading(true);
      const res = await axios.post("/api/categories", {
        name,
      });
      setCategories([...categories, res.data]);
      toast.success("Category Successfully Added");
      setLoading(false); //
    } catch (error) {
      setLoading(false); //
      toast.error((error as Error)?.response?.data);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const handleRemoveItem = async () => {
    try {
      setLoading(true);

      // Delete associated subcategories using a dedicated API endpoint
      await axios.delete(`/api/categories/${categoryIdToDelete}`);
      setLoading(false);

      const updatedCategories = categories.filter(
        (category) => category._id !== categoryIdToDelete
      );
      setCategories(updatedCategories);

      const categoryToDelete = categories.find(
        (category) => category._id === categoryIdToDelete
      );
      if (categoryToDelete) {
        const encodedCategoryName = encodeURIComponent(categoryToDelete.name);
        navigate(`/subcategories/${encodedCategoryName}`);
      }
      handleCloseDeleteDialog();
    } catch (error) {
      setLoading(false);

      console.error("Error removing category:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true); // Stop loading

      const response = await axios.get(`/api/categories`);
      setLoading(false); // Stop loading

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleOpenDeleteDialog = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryIdToDelete("");
  };

  const handleCatagoryClick = (catagoryName: string) => {
    // setOpen(false);
    navigate(`/categories/${catagoryName}`, {
      state: { showSubCategories: open },
    });
  };

  const [editCategory, setEditCategory] = useState(null); // Add state to track the category being edited

  const handleEditClick = (category: any) => {
    setEditCategory(category);
  };

  const handleSaveEdit = async (newName: String, editCategory: any) => {
    try {
      setLoading(true); // Stop loading

      await axios.post("/updateCategoryName", {
        previousName: editCategory,
        newName: newName,
      });

      // Update the categories with the updated name
      const updatedCategories: any = categories.map((category) =>
        category.name === editCategory
          ? { ...category, name: newName }
          : category
      );
      setCategories(updatedCategories);
      setEditCategory(null); // Close the modal
      toast.success("Category Name Updated Successfully");
      setLoading(false); // Stop loading
    } catch (error) {
      toast.error("Failed to update category name");
      console.error("Error updating category name:", error);
      setLoading(false); // Stop loading
    } finally {
      setLoading(false); // Stop loading
    }
  };
  console.log("open", open);
  console.log("window.innerWidth < 632 &&", window.innerWidth < 632);
  console.log("location.pathname", location.pathname);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {window.innerWidth < 632 && open && (
        <IconButton
          style={{ width: "100%", height: 60 }}
          onClick={() => {
            handleDrawerToggle();
          }}
        >
          {<ChevronRightIcon />}
        </IconButton>
      )}

      <Drawer
        variant="permanent"
        open={open}
        style={{
          display: window.innerWidth < 632 && open ? "block" : "block",
          ...(window.innerWidth < 632 && {
            position: "absolute",
            zIndex: 100,
            width: "50%",
          }),
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {window.innerWidth < 632 ? (
              <ChevronLeftIcon />
            ) : open === true ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {categories.length === 0 && (
            <ListItem
              disablePadding
              style={{
                display: open ? "flex" : "none",
              }}
            >
              <ListItemButton>
                <MessageContainer>No Category Added</MessageContainer>
              </ListItemButton>
            </ListItem>
          )}
          {!!categories.length &&
            categories.map((category, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  if (window.innerWidth < 632) {
                    setOpen(true);
                  }
                  handleCatagoryClick(category.name);
                }}
                disablePadding
                sx={{
                  display: "block",
                  bgcolor:
                    location.pathname ===
                    `/categories/${encodeURIComponent(category.name)}`
                      ? "rgb(245, 245, 245)"
                      : "white",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 12,

                    width: 140,
                    // overflow: 'hidden',
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                  }}
                >
                  <ListItemText
                    primary={category.name.toUpperCase()}
                    style={{
                      opacity: open ? 1 : 0.95,
                      fontSize: open ? "1rem" : "0.7rem",
                      fontWeight: "bold",
                      wordWrap: "break-word",
                    }}
                  />
                </ListItemButton>
                {/* remove list item */}

                {admin && (open || window.innerWidth < 632) && (
                  <div id="deleteCategory">
                    <button
                      onClick={() => {
                        if (window.innerWidth < 632) {
                          setOpen(false);
                        }
                        handleEditClick(category.name);
                      }}
                      id="onHover"
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "3px 5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.1s",
                        marginLeft: 2,
                      }}
                      // onMouseEnter={(e) => {
                      //   ; (e.target as HTMLElement).style.backgroundColor =
                      //     "rgba(255, 82, 82, 0.8)"
                      // }}
                      // onMouseLeave={(e) => {
                      //   ; (e.target as HTMLElement).style.backgroundColor =
                      //     "transparent"
                      // }}
                    >
                      <EditRoundedIcon />
                    </button>

                    <AddCategoryDialog
                      addCategory={(value: any) =>
                        handleSaveEdit(value, editCategory)
                      }
                      open={Boolean(editCategory)}
                      handleClose={handleClose}
                      name={editCategory}
                      isEdit={true}
                    />
                  </div>
                )}
                {admin && (open || window.innerWidth < 632) && (
                  <div id="deleteCategory">
                    <button
                      onClick={() => handleOpenDeleteDialog(category._id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "3px 5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.1s",
                        marginRight: 4,
                        marginLeft: 4,
                      }}
                      id="onHover"

                      // onMouseEnter={(e) => {
                      //   ; (e.target as HTMLElement).style.backgroundColor =
                      //     "rgba(255, 82, 82, 0.8)"
                      // }}
                      // onMouseLeave={(e) => {
                      //   ; (e.target as HTMLElement).style.backgroundColor =
                      //     "transparent"
                      // }}
                    >
                      <AutoDeleteRoundedIcon />
                    </button>

                    {/* Delete Confirmation Dialog  */}
                    {/* MADE A REUSABLE COMPONENT FOR DELETE CONFIRMATION -   */}

                    <DeleteConfirmationDialog
                      open={openDeleteDialog}
                      onClose={handleCloseDeleteDialog}
                      onRemove={handleRemoveItem}
                      title="Delete Category"
                      content=" Are you sure you want to delete this Category?"
                    />
                  </div>
                )}
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          <ListItem
            onClick={handleClickOpenAddCategoryDialog}
            disablePadding
            sx={{ display: "block" }}
          >
            {admin && (
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "",
                    justifyContent: "center",
                    fontSize: 22,
                    marginTop: -0.3,
                  }}
                >
                  +
                </ListItemIcon>
                <ListItemText
                  primary={"Add Category"}
                  sx={{
                    opacity: open ? 1 : 0,
                    display: !open ? "none" : "block",
                  }}
                />
              </ListItemButton>
            )}
          </ListItem>
        </List>
      </Drawer>

      <AddCategoryDialog
        addCategory={addCategory}
        open={openAddCategoryDialog}
        handleClose={handleClose}
        isEdit={false}
      />
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
  );
}
