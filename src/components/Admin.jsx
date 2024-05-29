import React, { useEffect, useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Admin = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const getCustomers = async () => {
    const response = await fetch('http://localhost:5000/api/customers', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const res = await response.json();
        console.log(res)
        if (response.status === 200) {
            setCustomers(res.data);
        }
    }

  useEffect(()=>{
    getCustomers();
  }, [])

  
  const handleViewClick = (customerId) => {
    navigate(`/user-plans/${customerId}`);
  }; 
  return (
    <TableContainer component={Paper} sx={{marginTop:5, padding: 2}}>
    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Customer ID</TableCell>
          <TableCell align="right">Customer Name</TableCell>
          <TableCell align="right">Customer Email</TableCell>
          <TableCell align="right">Customer Phone</TableCell>
          <TableCell align="right">Current Balance</TableCell>
          <TableCell align="right">Outstanding Balance</TableCell>
          <TableCell align="right">Payment Type</TableCell>
          <TableCell align="right">Plans</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer._id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {customer._id}
            </TableCell>
            <TableCell align="right">{customer.name}</TableCell>
            <TableCell align="right">{customer.email}</TableCell>
            <TableCell align="right">{customer.contactInformation.phone}</TableCell>
            <TableCell align="right">{customer.currentBalance}</TableCell>
            <TableCell align="right">{customer.outstandingBalance}</TableCell>
            <TableCell align="right">{customer.paymentType}</TableCell>
            <TableCell align="right"><Button variant='contained' size="small" onClick={()=>handleViewClick(customer._id)}>View</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}

export default Admin
