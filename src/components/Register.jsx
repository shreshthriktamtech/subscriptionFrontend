import { useMemo, useState } from 'react';
import countryList from 'react-select-country-list';

import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  TextField,
  CardActions,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState('Prepaid');

  const options = useMemo(() => countryList().getData(), []);

  const validateForm = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))
      tempErrors.email = 'Email address is invalid';
    if (!name) tempErrors.name = 'Name is required';
    if (!phone) tempErrors.phone = 'Phone is required';
    if (!country) tempErrors.country = 'Region is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const data = { name, email, phone, country };
    try {
      const response = await fetch('http://localhost:5000/api/create-customer', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const res = await response.json();
      if (response.status === 201) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Failed to connect to the server');
    }
  };

  const handleChange = (event) => setCountry(event.target.value);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card variant="outlined" sx={{ width: 360 }}>
        <CardHeader title="Register" />
        <CardContent>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Name"
              error={!!errors.name}
              helperText={errors.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Phone"
              error={!!errors.phone}
              helperText={errors.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
          <InputLabel id="region-label">Select Payment Method</InputLabel>
          <Select
              labelId="customers-label"
              id="customers-select"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              label="Select Payment Mehtod"
          >
              <MenuItem value="Prepaid">
                  Prepaid
              </MenuItem>
              <MenuItem value="Postpaid">
                  Postpaid
              </MenuItem>
          </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="region-label">Region</InputLabel>
            <Select
              labelId="region-label"
              id="region-select"
              value={country}
              error={!!errors.country}
              onChange={handleChange}
              label="Region"
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.country && <p style={{ color: 'red', fontSize: '0.75rem' }}>{errors.country}</p>}
          </FormControl>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default Register;
