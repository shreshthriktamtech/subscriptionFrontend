import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const Plans = ({ customerId }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch('http://localhost:5000/api/user-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      const data = await response.json();
      setPlans(data.data);
    };

    fetchPlans();
  }, [customerId]);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 1, padding: 2 }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Next Renew Date / Billing Date</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">IsActive</TableCell>
            <TableCell align="right">isProRated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan._id}>
              <TableCell>{plan._id}</TableCell>
              <TableCell align="right">{new Date(plan.startDate).toDateString()}</TableCell>
              <TableCell align="right">{plan.endDate ? new Date(plan.endDate).toDateString() : '-'}</TableCell>
              <TableCell align="right">{plan.renewalDate ? new Date(plan.renewalDate).toDateString() : '-'}</TableCell>
              <TableCell align="right">{plan.type}</TableCell>
              <TableCell align="right">{plan.details.name}</TableCell>
              <TableCell align="right">{plan.isActive ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="warning" />}</TableCell>
              <TableCell align="right">{plan.isProRated ? <Chip label="Yes" color="success" /> : <Chip label="No" color="warning" />}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Plans;
