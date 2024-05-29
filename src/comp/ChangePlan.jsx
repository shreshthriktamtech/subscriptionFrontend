import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "react-toastify";

function ChangePlan({ customerId }) {
  const [currentPlan, setCurrentPlan] = useState();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [packagePlans, setPackagePlans] = useState([]);
  const [payAsYouGoPlans, setPayAsYouGoPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/plans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch plans");

      const res = await response.json();
      setPackagePlans(res.data.filter((plan) => plan.type === "Package"));
      setPayAsYouGoPlans(res.data.filter((plan) => plan.type === "PayAsYouGo"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updatePlan = async (plan_id) => {
    try {
      const response = await fetch("http://localhost:5000/api/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customerId, 'planId': plan_id }),
      });

      const res = await response.json();
      if (response.ok) {
        toast.success(res.message);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error("Failed to change plan: " + error.message);
    }
  };

  const getCurrentPlan = async () => {
    const data = { customerId };
    const response = await fetch("http://localhost:5000/api/current-active-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (response.status === 200) {
      setCurrentPlan(res.data);
    } else {
      setCurrentPlan(null);
    }
  };

  useEffect(() => {
    fetchPlans();
    getCurrentPlan();
  }, []);

  const handleSelectChange = (event) => setSelectedPlan(event.target.value);

  return (
    <div>
      <Card variant="outlined">
        <CardContent className="w-full">
          <div>
            {currentPlan ? (
              <div>
                Every plan change will be effective from: {new Date(currentPlan.renewalDate).toDateString()}
              </div>
            ) : (
              <div>There is no current active plan</div>
            )}
          </div>
          <FormControl fullWidth margin="normal" disabled={!currentPlan}>
            <InputLabel id="plan-select-label">Select Plan</InputLabel>
            <Select
              labelId="plan-select-label"
              value={selectedPlan}
              onChange={handleSelectChange}
              fullWidth
              disabled={!currentPlan}
            >
              {payAsYouGoPlans.concat(packagePlans).map((plan) => (
                <MenuItem key={plan._id} value={plan._id}>
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={() => updatePlan(selectedPlan)}
            color="primary"
            disabled={!currentPlan}
          >
            Raise Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangePlan;
