import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Header from '../../common-components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';

export default function SelectAutoWidth() {
  const navigate = useNavigate();
  const [drug, setDrug] = React.useState('');
  const [ismodelOpen,setModelOpen] = React.useState(true);

  const handleChange = (event) => {
    setDrug(event.target.value);
  };

  const handleClick = ()=>{
    navigate('/dashboard');
  }

  return (
    <>
    <Header />
    <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh', // This ensures the container takes up the full height of the viewport
        }}
      >
        <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
        <p sx={{mb:2}}>Select your Drug</p>
        <div style={{ width: '300px' }}>
       <FormControl sx={{ m: 1, minWidth: 150 }}>
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
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Pembrolizumab'}>Pembrolizumab</MenuItem>
          <MenuItem value={'oxide'}>Oxide</MenuItem>
          <MenuItem value={'Paracetamol'}>Paracetamol</MenuItem>
        </Select>
        <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleClick}
              sx={{ mt: 3, mb: 2, bgcolor: '#26c95c' }} 
            >
              Submit
            </Button>
      </FormControl>
      </div>
      </Paper>
      </div>
      
    </>
  );
}