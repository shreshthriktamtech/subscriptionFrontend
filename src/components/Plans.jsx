import { useEffect, useState } from "react";
import { Typography, Box, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Plans() {
  const customerId = "66506affd07970d5e0ef86e3";
  const [packagePlans, setPackagePlans] = useState([]);
  const [payAsYouGoPlans, setPayAsYouGoPlans] = useState([]);
  const [currentActivePlan, setCurrentActivePlan] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [changePlan, setChangePlan] = useState(null);
  const [paymentType, setPaymentType] = useState('');
  const navigate = useNavigate();
  const [isPrepaid, setIsPrepaid] = useState(true);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const fetchPlans = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/plans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error('Failed to fetch plans');

      const res = await response.json();
      setPackagePlans(res.data.filter(plan => plan.type === "Package"));
      setPayAsYouGoPlans(res.data.filter(plan => plan.type === "PayAsYouGo"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/change-plan-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "customerId": customerId })
      });

      if (!response.ok) throw new Error('Failed to fetch customer details');

      const res = await response.json();
      setChangePlan(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchActivePlan = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/current-active-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) throw new Error('Failed to fetch active plan');

      const res = await response.json();
      setCurrentActivePlan(res.data.activePlan);
    } catch (error) {
      toast.error(error.message);
    }
  };


  const fetchPaymentType = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      const res = await response.json();
      console.log(res)
      setIsPrepaid(res.data=='Prepaid')
      setPaymentType(res.data)
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updatePlan = async (plan_id) => {
    try {
      const response = await fetch('http://localhost:5000/api/change-plan', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, plan_id })
      });

      const res = await response.json();
      if (response.ok) {
        toast.success(res.message);
        fetchCustomerDetails();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error("Failed to change plan: " + error.message);
    }
  };

  const handleSelectChange = (event) => setSelectedPlan(event.target.value);

  const handleSwitchChange = async (event) => {
    const newPaymentType = event.target.checked ? 'Prepaid' : 'Postpaid';
    console.log(newPaymentType);
    setIsPrepaid(event.target.checked);
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
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update payment type: " + error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchActivePlan();
    fetchCustomerDetails();
    fetchPaymentType();
  }, []);

  const renderPlanChangeRequest = () => {
    if (changePlan && changePlan.changePlanRequest && changePlan.changePlanRequest.isActive) {
      return (
        <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
          <div>
            You have requested for a plan change to <b>{changePlan.plan.name}</b><br />
            Requested On: {new Date(changePlan.changePlanRequest.requestedDate).toDateString()}
          </div>
          <Button variant="outlined">Cancel Request</Button>
        </Box>
      );
    }
    return null;
  };
  const renderCurrentPaymentType = () => {
    if (paymentType) {
      return (
        <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
          <Typography>Postpaid</Typography>
          <Switch checked={isPrepaid} onChange={handleSwitchChange} name="paymentTypeSwitch" />
          <Typography>Prepaid</Typography>
        </Box>
      );
    }
    return null;
  };
  const renderCurrentPlan = () => {
    if (!currentActivePlan || !currentActivePlan.details) {
      return (
        <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
          <div>No plan is activated as of now</div>
        </Box>
      );
    }

    const { details, type, renewalDate } = currentActivePlan;
    const renewalDateStr = new Date(renewalDate).toDateString();

    return (
      <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
        <div>
          Your Account is <b>{paymentType}</b>
          <Typography>{type === "Package" ? `Package: ${details.name}` : details.name}</Typography>
          {type === "Package" ? (
            <>
              <Typography className="text-success">{details.interviewsUsed} / {details.interviewsPerQuota} Interviews Used</Typography>
              <Typography>Renewal Date: {renewalDateStr}</Typography>
            </>
          ) : (
            <Typography className="palette.success.main">Rs {details.interviewRate} / interview</Typography>
          )}
        </div>
        <Button variant="outlined" className="self-end mt-auto" onClick={handleOpenDialog}>
          {type === "PayAsYouGo" ? "Add Credits / Request change plan" : "Request change plan"}
        </Button>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
          <DialogTitle>{type === "PayAsYouGo" ? "Add Credits/ Raise a change plan request" : "Raise a change plan request"}</DialogTitle>
          <DialogContent>
            {type === "PayAsYouGo" && (
              <Button variant="contained" onClick={() => navigate('/topup')}>Add Credits</Button>
            )}
            <FormControl fullWidth margin="normal">
              <InputLabel id="plan-select-label">Select Plan</InputLabel>
              <Select labelId="plan-select-label" value={selectedPlan} onChange={handleSelectChange} fullWidth>
                {payAsYouGoPlans.concat(packagePlans).map((plan) => (
                  <MenuItem key={plan._id} value={plan._id}>{plan.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
            <Button onClick={() => updatePlan(selectedPlan)} color="primary">Raise Request</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <div className="mt-2">
      {renderCurrentPaymentType()}
      {renderPlanChangeRequest()}
      {renderCurrentPlan()}
    </div>
  );
}

export default Plans;
