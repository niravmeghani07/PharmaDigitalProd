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
import { useState } from "react";
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
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import HandleNotification from "../HandleNotification/HandleNotification";


const pages = []; //Pass Value to add menu options
const settings = ["Notification","Edit User","Logout"]; //Pass value to add options if clicked on profile icon

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [drug,setDrug] = useState('');
  const drugList = ['Pembrolizumab', 'Paracetamol', 'Oxide'];
  const [isPendingModalOpen, setPendingModalOpen] = useState(false);
  const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
  const navigate = useNavigate();
  const [notificationClicked, setNotificationClicked] = useState(false);
  //const [isnavigated,setIsNavigated] = useState(false);
  const userDesignation = sessionStorage.designation;

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

  const handleSearchChange = (event, newValue) => {
    setSearchTerm(newValue);
   // setIsNavigated(true);
    navigate('/dashboard');
  };

  const handleSelectDrug = (event, value) => {
    setSearchTerm(value);
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

  const handleNotification = () => {
    if (userDesignation === 'Analyst') {
      setPendingModalOpen(true);
      setNotificationClicked(true);
      console.log('Notification clicked as an Analyst'+ notificationClicked);
    }
    else{
      setApprovalModalOpen(true);
      setNotificationClicked(true);
    }   
  
  }

  const handleDrugSelect = (drug) =>{
    setDrug(drug);
    setShowDropdown(false);
  }

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

          <Autocomplete
              value={searchTerm}
              onChange={handleSelectDrug}
              inputValue={searchTerm}
              onInputChange={handleSearchChange}
              options={drugList}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Drug"
                  placeholder="Select Drug"
                  sx={{ mr: 2, width: '250px', bgcolor: 'white', borderRadius: '10px' }}
                />
              )}
            />
             
            {/* {showDropdown &&(
              <Box sx={{ position: 'absolute', zIndex: 9999, mt: 3 }}>
              <Menu
                id="drug-dropdown"
                anchorEl={document.getElementById('drug-search')}
                open={showDropdown}
                onClose={() => setShowDropdown(false)}
              >
                {drugList.map((drug, index) => (
                  <MenuItem key={index} onClick={() => handleDrugSelect(drug)}>
                    {drug}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            )} */}

            <Box sx={{ flexGrow: 0 }}>
              {/* <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip> */}

              <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
              <Avatar alt="Remy Sharp" />{/*User ICON*/}
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
                  <MenuItem key={setting} onClick={setting === 'Edit User' ? handleEditUser : setting === 'Notification' ? handleNotification : handleLogout}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
                
                ))}
              </Menu>
            </Box>

              {isPendingModalOpen && userDesignation === 'Analyst' && (
                <HandleNotification
                  isPendingModalOpen={isPendingModalOpen}
                />
              )}
              {isApprovalModalOpen && userDesignation !== 'Analyst' && (
                <HandleNotification
                  isApprovalModalOpen={isApprovalModalOpen}
                />
              )}

          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
export default Header;
