import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import NavMenu from "./components/NavMenu"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import { useMediaQuery } from "@mui/material"
import Socials from "./components/Socials"
import Subscribe from "./pages/Subscribe"
import { Toaster } from "react-hot-toast"
import { AuthContextProvider } from "./context/AuthContext"
import AdminLogin from "./pages/AdminLogin"
import { SubCategories } from "./components/SubCategories"
import ManagePost from "./pages/ManagePost"
import SubcategoryPage from "./components/SubcategoryPage"
import PostPage from "./pages/PostPage"
import "./assets/style/App.css"
function App() {
  const isMobile = useMediaQuery("(max-width:600px)")

  return (
    <AuthContextProvider>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Header />

          <div
            style={{
              height: window.location.pathname.includes("/Contact") ? "100vh" : window.innerWidth < 632 ? window.innerHeight - 183 : window.innerHeight - 93,
              overflow: "scroll",
              display:
                "flex",
            }}
          >
            <Routes>
              <Route path="/Contact" element={<Contact />} />
            </Routes>
            {/* Main Content */}
            <div style={{ flex: 1, display: "flex" }}>
              {/* Left Sidebar */}
              {!window.location.pathname.includes("/admin") && !window.location.pathname.includes("/Contact") && <NavMenu />}

              {/* Middle Content */}
              <div style={{ flex: 1, paddingTop: "20px", }}>
                <Toaster />

                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* <Route path="/AddBlog" element={<AddBlog />} /> */}
                  <Route path="/Subscribe" element={<Subscribe />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route
                    path="/categories/:categoryName"
                    element={<SubCategories />}
                  />
                  <Route
                    path="/categories/:categoryName/subcategories/:subCategoryName"
                    element={<SubcategoryPage />}
                  />
                  <Route path="/manage" element={<ManagePost />} />
                  <Route path="/manage/:postId" element={<ManagePost />} />
                  <Route path="/post/:postId" element={<PostPage />} />
                </Routes>

              </div>
            </div>
            {/* Right Sidebar (not displayed on mobile) */}
            {!isMobile && (
              <div
                id="rightBar"
              >
                <Socials />
              </div>
            )}
          </div>

          {window.location.pathname !== "/Contact" && <Footer />}
        </div>
      </Router>
    </AuthContextProvider>
  )
}

export default App
