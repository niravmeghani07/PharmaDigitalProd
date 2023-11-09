import "./Header.css";
// import userImage from "../../assets/user.png";
// import menu from "../../assets/menu.png";
import deloitteLogo from "../../assets/deloitte.svg";


// function Header(props) {
//   return (
//     <div className="pharma-header">
//       <div className="header-logo">
//         <img style={{ width: "20vh" }} src={deloitteLogo} alt="Deloitte Logo" />
//       </div>
//       <div className="content">Process Development Platform</div>
//       <div className="image-container">
//         <img
//           style={{ height: "22px", marginRight: "5px", cursor: "pointer" }}
//           src={userImage}
//           alt="user avatar"
//         />
//         <img
//           style={{ height: "25px", cursor: "pointer" }}
//           src={menu}
//           alt="user avatar"
//         />
//       </div>
//     </div>
//   );
// }

// export default Header;

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from 'react-router-dom';

const pages = []; //Pass Value to add menu options
const settings = ["Edit User","Logout"]; //Pass value to add options if clicked on profile icon

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () =>{
    sessionStorage.clear(); // Clear any user data stored in session storage
    navigate('/login');
    // Close the user menu or perform any other necessary cleanup
    handleCloseUserMenu();
  }

  const handleEditUser = () => {
    // Close the user menu
    handleCloseUserMenu();
    // Use the navigate function to go to the "Edit User" page
    navigate('/edit-user');
  };
  

  return (
    <div className="pharma-header">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            <img
              style={{ width: "130px", aspectRatio: "auto 182 / 34" }}
              src={deloitteLogo}
              alt="Deloitte Logo"
            />

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                // fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                justifyContent: "center",
                width: "86%",
              }}
            >
              BOP Builder
            </Typography>
           
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              {/* <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton> */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".05rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Process Development Platform
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {/* <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip> */}
              <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />{/*User ICON*/}
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={setting === 'Edit User' ? handleEditUser : handleLogout}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
                
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
export default Header;
