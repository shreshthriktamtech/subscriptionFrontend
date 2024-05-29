import { FormControl, FormHelperText, InputLabel, Input, Box, Card, CardHeader, CardContent, Select, Button, TextField, MenuItem, FormControlLabel, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UpdateCustomer = ({ customerId }) => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    currency: '',
    tax: '',
    paymentType: 'Postpaid',
    canOveruseInterviews: false,
    interviewRate: 0,
  });

  const getCustomer = async () => {
    const data = { customerId };
    const response = await fetch('http://localhost:5000/api/customer-details', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const res = await response.json();
    if (response.status === 200) {
      setForm({
        email: res.data.email,
        name: res.data.name,
        phone: res.data.contactInformation.phone,
        currency: res.data.currency,
        tax: res.data.tax,
        paymentType: res.data.paymentType,
        canOveruseInterviews: res.data.canOveruseInterviews,
        interviewRate: res.data.interviewRate
      });
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'canOveruseInterviews' ? value === 'true' : value
    }));
  };

  const handleSwitchChange = (e) => {
    setForm(prevForm => ({
      ...prevForm,
      paymentType: e.target.checked ? 'Prepaid' : 'Postpaid'
    }));
  };

  const handleSubmit = async () => {
    const response = await fetch(`http://localhost:5000/api/update-customer/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });
    const res = await response.json();
    if (response.status === 200) {
      toast.success(res.message);
      getCustomer();
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader title={"Update Customer"} />
      <CardContent className='w-full'>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Phone"
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Currency"
            type="text"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Tax (%)"
            type="number"
            name="tax"
            value={form.tax}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
        <TextField
          label="Interview Rate"
          type="number"
          name="interviewRate"
          value={form.interviewRate}
          onChange={handleChange}
        />
      </FormControl>
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            control={
              <Switch
                checked={form.paymentType === 'Prepaid'}
                onChange={handleSwitchChange}
                name="paymentType"
                color="primary"
              />
            }
            label="Prepaid"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="can-overuse-interviews-label">Can Overuse Interviews?</InputLabel>
          <Select
            labelId="can-overuse-interviews-label"
            id="can-overuse-interviews"
            name="canOveruseInterviews"
            value={form.canOveruseInterviews}
            onChange={handleChange}
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          style={{ marginTop: '10px', marginLeft: '10px' }}
          onClick={handleSubmit}
        >
          Update Customer
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateCustomer;
