import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Button from "@mui/material/Button";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform username and password validation here
    if (password === 'Cloud123') {
      // If the username and password are correct, navigate to the dashboard
      sessionStorage.userName = username;
      sessionStorage.password = password;
      sessionStorage.isUserLoggedIn = "true";
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
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
