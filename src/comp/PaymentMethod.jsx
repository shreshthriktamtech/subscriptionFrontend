import { useEffect, useState } from "react";
import { Box, Typography, Switch, FormControlLabel } from "@mui/material";
import { toast } from "react-toastify";

const PaymentMethod = ({ customerId }) => {
  const [paymentType, setPaymentType] = useState('');
  const [isPrepaid, setIsPrepaid] = useState(false);

  const fetchPaymentType = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) throw new Error('Failed to fetch payment type');

      const res = await response.json();
      setIsPrepaid(res.data === 'Prepaid');
      setPaymentType(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSwitchChange = async (event) => {
    const newPaymentType = event.target.checked ? 'Prepaid' : 'Postpaid';
    try {
      const response = await fetch('http://localhost:5000/api/update-payment-type', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, paymentType: newPaymentType })
      });

      const res = await response.json();
      if (response.ok) {
        toast.success(res.message);
        setPaymentType(newPaymentType);
        setIsPrepaid(event.target.checked);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update payment type: " + error.message);
    }
  };

  useEffect(() => {
    fetchPaymentType();
  }, []);

  return (
    <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
      <Typography>Postpaid</Typography>
      <Switch checked={isPrepaid} onChange={handleSwitchChange} name="paymentTypeSwitch" />
      <Typography>Prepaid</Typography>
    </Box>
  );
};

export default PaymentMethod;
