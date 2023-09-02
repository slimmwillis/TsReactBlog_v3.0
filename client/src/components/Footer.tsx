import React from "react";
import Socials from "../components/Socials"

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      {window.innerWidth < 632 && !window.location.pathname.includes("/Contact") && <div
        id="rightBar"
        style={{
          flex: "0 0 auto",
          background: "white"
        }}
      >
        <Socials />
      </div>}
      <div
        className="footer"
        style={{
          display: "flex",
          justifyContent: "center",
          background: "linear-gradient(to right, #bbeeff, #fbfeff)",
        }}
      >
        <a style={{ color: "black" }} href="/Contact">
          Contact Me
        </a>
      </div>

    </React.Fragment>
  );
};

export default Footer;
