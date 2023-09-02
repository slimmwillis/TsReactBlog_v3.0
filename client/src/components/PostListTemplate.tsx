import { useContext, useState } from "react"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import "../assets/style/navMenu.css"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import { AuthContext, AuthContextType } from "../context/AuthContext"
import AddPostDialog from "./ArchiveAddPostDialog"

export function PostListTemplate() {
  const initialList: any = []
  const navigate = useNavigate()
  const [posts, setPosts] = useState(initialList)
  const { admin } = useContext(AuthContext) as AuthContextType

  const [openAddPostDialog, setOpenAddPostDialog] = useState(false)

  const handleClickOpenPost = () => {
    navigateToManagePost()
  }

  const navigateToManagePost = () => {
    navigate(`/manage`)
  }

  const handleClosePost = () => {
    setOpenAddPostDialog(false)
  }

  function addPost() {
    setPosts([...posts, posts])
  }
  return (
    <>
      {/* ************POST TEMPLATE******** */}

      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {admin && <Button
          onClick={handleClickOpenPost}
          variant="contained"
          sx={{ my: 3, mx: "auto" }}
        >
          Add Post
        </Button>}

        <AddPostDialog
          addPost={addPost}
          open={openAddPostDialog}
          handleClose={handleClosePost}
        />
      </Box>
    </>
  )
}

