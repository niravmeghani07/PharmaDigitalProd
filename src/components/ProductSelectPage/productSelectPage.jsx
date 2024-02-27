import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Header from '../../common-components/Header/Header';
import Sidebar from '../../common-components/SideBar/SideBar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import "./productSelectPage.css";

export default function SelectAutoWidth() {
  const navigate = useNavigate();
  const [drug, setDrug] = React.useState('');

  const handleChange = (event) => {
    setDrug(event.target.value);
  };

  const handleClick = () => {
    navigate('/dashboard');
  };

  const handleNewDrug = () => {
    navigate('/newDrug');
  };

  return (
    <>
    <div style={{ display: 'flex', height: '100vh' }}>
  <div className="sidebar">
    <Header />
    <Sidebar /> 
  </div>
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px', // Add padding to provide spacing
    }}
  >
    <Paper elevation={3} sx={{ p: 2, maxWidth: 1000, textAlign: 'center' }}>
      <p sx={{ mt: 2, mb: 2 }}>Select your Drug</p>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {/* Centering the drug selection components */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-autowidth-label">Drug</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={drug}
            onChange={handleChange}
            autoWidth
            label="drug"
          >
            <MenuItem value="">
              {/* <em>None</em> */}
            </MenuItem>
            <MenuItem value={'Pembrolizumab'}>Pembrolizumab</MenuItem>
            <MenuItem value={'Oxide'}>Oxide</MenuItem>
            <MenuItem value={'Paracetamol'}>Paracetamol</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleClick}
        sx={{ mt: 3, mb: 1, bgcolor: '#26c95c' }}
      >
        Submit
      </Button>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleNewDrug}
        sx={{ mt: 1, mb: 1, bgcolor: '#26c95c' }}
      >
        New Drug
      </Button>
    </Paper>
  </div>
</div>

    </>
  );
}
