import React from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../assets/style/header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    navigate("/Subscribe");
  };

  return (
    <div className="header-container">
      <Grid
        container
        alignItems="center"
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
          background: "linear-gradient(to right, #bbeeff, #fbfeff)",
        }}
      >
        <Grid item xs={4} textAlign="center">
          <button
            onClick={handleSubscribeClick}
            className="custom-btn subButton"
          >
            <span>Click!</span>
            <span>Subscribe</span>
          </button>
        </Grid>
        <Grid
          item
          xs={window.innerWidth > 568 ? 4 : 8}
          textAlign="center"
          sx={{ fontSize: "150%", fontWeight: "bold" }}
        >
          <a className="blog-link" href="/">
            William's Blog
          </a>
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
