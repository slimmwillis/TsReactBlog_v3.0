import { useContext, useEffect, useState, Fragment } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "../assets/style/navMenu.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import AddSubCategoryDialog from "./AddSubCategoryDialog";
import axios from "axios";
import { toast } from "react-hot-toast";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import CircularProgress from "@mui/material/CircularProgress";

const drawerWidth = "100%";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": { ...openedMixin(theme) },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export function SubCategories() {
  const initialList: any = [];
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [subCategories, setSubCategories] = useState(initialList);
  const [browserWindowWidth, setBrowserWindowWidth] = useState(
    window.innerWidth
  );
  const showSubCategories = location.state?.showSubCategories || true;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setBrowserWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //imported states
  const { categoryName, subCategoryName } = useParams<{
    categoryName: string;
    subCategoryName: string;
  }>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [subCategoryIdToDelete, setSubCategoryIdToDelete] = useState("");

  const { admin } = useContext(AuthContext) as AuthContextType;

  const [openAddSubCategoryDialog, setOpenAddSubCategoryDialog] =
    useState(false);

  const [category, setCategory] = useState<any>(null);
  const [editSubCategory, setEditSubCategory] = useState(null); // Add state to track the category being edited
  const handleSaveEdit = async (newName: String, editCategory: any) => {
    try {
      setLoading(true);
      await axios.post("/updateSubCategory", {
        previousName: editCategory,
        newName: newName,
        categoryName: categoryName,
      });

      setEditSubCategory(null); // Close the modal
      toast.success("Subcategory Name Updated Successfully");
      getCategory();
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error("Failed to update sub category name");
      console.error("Error updating sub category name:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const params = useParams();

  const getCategory = async () => {
    try {
      // weird bug to discusss. axios.get(`/api/categories/${params.categoryName}`) throws a network 404 error
      setLoading(true);

      const res = await axios.get(`/api/categories/${categoryName}`);
      setCategory(res.data);
      setSubCategories(res.data.subCategories);
      setLoading(false); //
    } catch (error) {
      setLoading(false); //

      navigate("/");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getCategory();
  }, [params]);

  const handleClickOpen = () => {
    setOpenAddSubCategoryDialog(true);
  };

  const handleClose = () => {
    setOpenAddSubCategoryDialog(false);
    setEditSubCategory(null);
  };
  async function addSubCategory(name: string) {
    try {
      setLoading(true);

      const res = await axios.post(
        `/api/categories/${category._id}/subcategories`,
        { name }
      );
      setSubCategories([...subCategories, res.data]);
      setLoading(false);

      toast.success("Category Successfully Added");
    } catch (error) {
      setLoading(false);

      toast.error((error as any)?.response?.data);
    } finally {
      setLoading(false); // Stop loading
    }
  }
  const handleOpenDeleteDialog = (subCategoryId: string) => {
    setSubCategoryIdToDelete(subCategoryId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSubCategoryIdToDelete("");
  };

  const handleDeleteSubCategory = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/subcategories/${subCategoryIdToDelete}`);
      // Remove the deleted subcategory from the subcategory array
      setLoading(false); //

      setSubCategories(
        subCategories.filter(
          (subCategory: any) => subCategory._id !== subCategoryIdToDelete
        )
      );
      handleCloseDeleteDialog();
    } catch (error) {
      setLoading(false); //

      console.error("Error deleting subcategory:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {showSubCategories && (
        <Box sx={{ display: "flex" }}>
          {/* <CssBaseline /> */}

          <Drawer variant="permanent" open={open} sx={{ flex: 1 }}>
            <Divider />
            <List>
              {subCategories.map((subCategory: any, index: any) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    bgcolor:
                      location.pathname ===
                      `/categories/${encodeURIComponent(subCategory.name)}`
                        ? "rgb(245, 245, 245)"
                        : "white",
                  }}
                >
                  <ListItemButton
                    onClick={() =>
                      navigate(
                        `/categories/${category.name}/subcategories/${subCategory.name}`
                      )
                    }
                    sx={{
                      minHeight: 12,
                      width: "30%",
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                    }}
                  >
                    <ListItemText
                      primary={subCategory.name}
                      style={{
                        opacity: open ? 1 : 0.95,
                        fontSize: open ? "1rem" : "0.5rem",
                        color: open ? "black" : "black",
                        wordWrap: "break-word",
                      }}
                    />
                  </ListItemButton>

                  {/* remove list item */}

                  {admin && (
                    <button
                      onClick={() => {
                        setEditSubCategory(subCategory.name);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "rgba(255, 82, 82, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {admin && (
                    <button
                      onClick={() => handleOpenDeleteDialog(subCategory._id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "rgba(255, 82, 82, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      Delete
                    </button>
                  )}

                  {/* Delete Confirmation Dialog */}
                  {/* MADE A REUSABLE COMPONENT FOR DELETE CONFIRMATION -   */}
                  <DeleteConfirmationDialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    onRemove={handleDeleteSubCategory}
                    title="Delete Subcategory"
                    content="Are you sure you want to delete this subcategory?"
                  />
                </ListItem>
              ))}
            </List>
            {admin && (
              <Fragment>
                <Divider />
                <List>
                  <ListItem
                    onClick={handleClickOpen}
                    disablePadding
                    sx={{ display: "block" }}
                  >
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
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </ListItemIcon>
                      <ListItemText
                        primary={"Add Subcategory"}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Fragment>
            )}
          </Drawer>
        </Box>
      )}
      <AddSubCategoryDialog
        addSubCategory={addSubCategory}
        open={openAddSubCategoryDialog}
        handleClose={handleClose}
        editSubCategory={editSubCategory}
      />
      <AddSubCategoryDialog
        addSubCategory={(value) => handleSaveEdit(value, editSubCategory)}
        open={Boolean(editSubCategory)}
        handleClose={handleClose}
        editSubCategory={editSubCategory}
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

      {/* <PostListTemplate /> */}
    </>
  );
}
