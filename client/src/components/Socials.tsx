import React from 'react';
import { Box, Link, Tooltip } from '@mui/material';
import youtube from "../assets/images/youtube.png";
import facebook from "../assets/images/facebook.png";
import whatsapp from "../assets/images/whatsapp.png";
import CodePen from "../assets/images/codepen.png";
import GitHub from "../assets/images/github.png";


const socialLinks = [
  { title: "WhatsApp", href: "https://wa.me/19048005911", icon: whatsapp },
  { title: "Facebook", href: "https://www.facebook.com/Wbailey89", icon: facebook },
  { title: "YouTube", href: "https://www.youtube.com/watch?v=zgv5PwZnxd0", icon: youtube },
  { title: "CodePen", href: "https://codepen.io/Slimmwillis", icon: CodePen },
  { title: "GitHub", href: "https://github.com/slimmwillis", icon: GitHub },

];

const Socials: React.FC = () => {
  return (
    <Box
      sx={{
        typography: 'body1',
        display: 'flex',
        flexDirection: window.innerWidth < 632 ? "row" : 'column',
        background: 'white',
        p: 2,
        gap: 1,
        flexWrap: "wrap"
      }}
    >
      {socialLinks.map((link) => (
        <Link target="_blank" style={{ color: 'black', display: 'flex', alignItems: 'center' }} id="social_icon" href={link.href}>
          <img src={link.icon} alt={`${link.title} Icon`} style={{ marginRight: '8px', width: '24px', height: '24px' }} />
          {link.title}
        </Link>
      ))}
    </Box>
  );
};

export default Socials;
