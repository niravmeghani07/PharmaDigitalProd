import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import "./Loader.css";

function Loader() {
  return (
    <div className='pharma-loader'>
    <CircularProgress disableShrink />
    </div>
  );
}
export default Loader;
