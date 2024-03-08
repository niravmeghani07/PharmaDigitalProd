import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Select, MenuItem } from '@mui/material';
import { Radio, RadioGroup, InputLabel} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import './EditUserPage.css'

const defaultTheme = createTheme();


export default function SignUp() {
  const navigate = useNavigate();
  const [designation, setDesignation] = React.useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
    const userData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
      designation: designation,
    };
    console.log(userData);
    
    try{
      const res = await axios.post('http://localhost:5000/api/register', userData);
      console.log('User registered successfully:', res.data);
      navigate('/login');
    }
    
    catch (error) {
      console.error('Error registering user:', error.message);
      // Handle errors or show an error message to the user
    }
  };
  
  const handleDesignationChange = (event) => {
    setDesignation(event.target.value);
  };
  const handleLoginLinkClick = ()=>{
    navigate('/login');
  }
  return (
    <div className='signup-page'>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={3} >
             
              <InputLabel id="designation-label">Designation</InputLabel>
              </Grid>

              <Grid item xs={12} >
                  <RadioGroup
                  aria-label="designation"
                  name="designation"
                  id="designation"
                  value={designation}
                  onChange={handleDesignationChange}
                  row
                >
                {/* Add FormControlLabel for each radio button option */}
                <FormControlLabel value="Analyst" control={<Radio />} label="Analyst" />
                <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
              </RadioGroup>

            </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#26c95c' }} 
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link 
                  onClick={handleLoginLinkClick} 
                  variant="body2"
                  sx={{ color: 'rgb(44, 100, 212)', cursor: 'pointer' }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/*<Copyright sx={{ mt: 5 }} />*/}
      </Container>
    </ThemeProvider>
    </div>
  );
}