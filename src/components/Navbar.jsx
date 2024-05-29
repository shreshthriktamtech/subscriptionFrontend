import {Box, AppBar, Toolbar, Typography, Button} from '@mui/material'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); 
  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Subscription Model
        </Typography>
        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
        <Button color="inherit" onClick={() => navigate('/plans')}>Plans</Button>
        <Button color="inherit" onClick={() => navigate('/create-plans')}>Create Plans</Button>
        <Button color="inherit" onClick={() => navigate('/billing')}>Billing</Button>
        <Button color="inherit" onClick={() => navigate('/transactions')}>Transactions</Button>
        <Button color="inherit" onClick={() => navigate('/topup')}>TopUp</Button>
        <Button color="inherit" onClick={() => navigate('/interviews')}>Interviews</Button>
        <Button color="inherit" onClick={() => navigate('/assign-plan')}>Assign Plan</Button>
        <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default Navbar
