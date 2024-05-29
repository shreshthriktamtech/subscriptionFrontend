import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import Plans from '../comp/Plans';
import AssignPlan from '../comp/AssignPlan';
import UpdateBilling from '../comp/UpdateBilling';
import UpdateCustomer from '../comp/UpdateCustomer';
import Transactions from '../comp/Transactions';
import ChangePlan from '../comp/ChangePlan';

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

const AdminPlans = () => {
  const { customerId } = useParams();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ marginTop: '5px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
          <Tab label="Plans" {...a11yProps(0)} />
          <Tab label="Transactions" {...a11yProps(1)} />
          <Tab label="Update Billing Cycle" {...a11yProps(2)} />
          <Tab label="Change Plan" {...a11yProps(3)} />
          <Tab label="Assign Plan" {...a11yProps(4)} />
          <Tab label="Update Customer" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Plans customerId={customerId} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Transactions customerId={customerId} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UpdateBilling customerId={customerId}></UpdateBilling>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ChangePlan customerId={customerId}></ChangePlan>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AssignPlan customerId = {customerId}></AssignPlan>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <UpdateCustomer customerId = {customerId}></UpdateCustomer>
    </TabPanel>
    </div>
  );
};

export default AdminPlans;
