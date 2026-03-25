import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import Loader from "../components/Loader";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleConfirmLogout = () => {
    try {
      localStorage.removeItem('UserToken');
      toast.success('Logged out successfully.');
      navigate('/login');
    } catch (error) {
      toast.error('Error in logout.');
      navigate('/login');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Loader open={loading} />
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent style={{ px: 3, py: 2 }}>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
