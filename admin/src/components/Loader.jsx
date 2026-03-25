import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader({ open }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9999 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
