import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Button from "@mui/material/Button";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // const handleDesignationChange = (e) => {
  //   const selectedDesignation = e.target.value;
  //   setDesignation(selectedDesignation);

  //   // Store the selected designation in sessionStorage
  //   sessionStorage.designation = selectedDesignation;
  // };

  // const handleDropdownClick = () => {
  //   // Set a default value when the dropdown is clicked
  //   if (designation === '') {
  //     setDesignation('Select Designation');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.get("http://localhost:5000/api/register");
      const userData = response.data;
      const requiredUserData = userData.find(user => user.firstName === username);
  
      if (requiredUserData) {
        const userPassword = requiredUserData.password;
        const designation = requiredUserData.designation;
  
        // Perform username and password validation here
        if (password === userPassword) {
          // If the username and password are correct, store the information in sessionStorage
          sessionStorage.userName = username;
          sessionStorage.password = password;
          sessionStorage.designation = designation;
          sessionStorage.isUserLoggedIn = "true";
  
          // Navigate to the dashboard
          navigate('/dashboard');
        } else {
          setError('Invalid username or password');
        }
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle errors or show an error message to the user
    }
  };
  
  

  const handleSignupClick = () => {
    // Navigate to the EditUserPage.jsx when the Signup button is clicked
    navigate('/edit-user');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {/* <div className="select-group">
            <label htmlFor="designation">Designation</label>
            <select
              id="designation"
              value={designation}
              onChange={handleDesignationChange}
              onClick={handleDropdownClick}
            >
              <option value="">Select Designation</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div> */}
          {error && <p className="error">{error}</p>}
          <div className="button-group">
            <Button variant="contained" color="primary" type="submit" style={{ marginRight: '8px' }}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={handleSignupClick}>
              Signup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
