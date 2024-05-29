import { useEffect, useState } from "react";
import { Typography, Box, Switch, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Plans() {
  const customerId = "66506affd07970d5e0ef86e3";
  const [packagePlans, setPackagePlans] = useState([]);
  const [payAsYouGoPlans, setPayAsYouGoPlans] = useState([]);
  const [currentActivePlan, setCurrentActivePlan] = useState([]);
  const [isPayAsYouGo, setIsPayAsYouGo] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const navigate = useNavigate();


  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const getPlans = async () => {
    const response = await fetch("http://localhost:5000/api/plans", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    const packagePlans = res.data.filter((plan) => plan.type === "Package");
    const payAsYouGoPlans = res.data.filter(
      (plan) => plan.type === "PayAsYouGo"
    );
    setPackagePlans(packagePlans);
    setPayAsYouGoPlans(payAsYouGoPlans);
  };

  const getActivePlan = async () => {
    const data = {
      customerId,
    };
    const response = await fetch(
      "http://localhost:5000/api/current-active-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const res = await response.json();
    console.log(res);
    if (response.status == 200) {
      setCurrentActivePlan(res.data);
      console.log(res.data);
    }
  };
  
  const updatePlan = async (plan_id)=>{
    const data = {
        customerId,
        plan_id
    };
    try {
        const response = await fetch('http://localhost:5000/api/change-plan', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const res = await response.json();
        console.log(response.status);
        if (response.status === 200) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }

    } catch (error) {
        toast.error("Failed to generate bill: " + error.message);
    }
  }



  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };


  useEffect(() => {
    getPlans();
    getActivePlan();
    getCustomer();
  }, []);

  return (
    <div className="mt-2">
      {currentActivePlan &&
      currentActivePlan.details &&
      currentActivePlan.type == "Package" ? (
        <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
          <div>
            Your Plan is <b>{currentActivePlan.paymentType}</b>
            <Typography>Package: {currentActivePlan.details.name}</Typography>
            <Typography className="text-success">
              {currentActivePlan.details.interviewsUsed} /{" "}
              {currentActivePlan.details.interviewsPerQuota} Interviews Used
              
            </Typography>
            <Typography>
            Renewal Date: {new Date(currentActivePlan.renewalDate).toDateString()}
            </Typography>
          </div>
          <Button
            variant="outlined"
            className="self-end mt-auto"
            onClick={handleOpenDialog}
          >
          Request change plan
          </Button>
          <Dialog open={dialogOpen} onClose={handleCloseDialog} className="w-100" maxWidth='lg' fullWidth>
            <DialogTitle>Raise a change plan request</DialogTitle>

             <Typography className="text-center flex justify-center">
              
            </Typography>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                <InputLabel id="plan-select-label">Select Plan</InputLabel>
                <Select
                    labelId="plan-select-label"
                    value={selectedPlan}
                    onChange={handleSelectChange}
                    fullWidth
                >
                    {packagePlans.map((plan) => (
                    <MenuItem key={plan._id} value={plan._id}>{plan.name}</MenuItem>
                    ))}
                </Select> 
            </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={()=>updatePlan(selectedPlan)} color="primary">
                Raise Request
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        ""
      )}

      {currentActivePlan &&
      currentActivePlan.details &&
      currentActivePlan.type == "PayAsYouGo" ? (
        <Box className="border shadow-md rounded-md m-5 p-2 flex flex-row justify-between">
        <div>
          Your Plan is {currentActivePlan.paymentType}
          <Typography>{currentActivePlan.details.name}</Typography>
          <Typography className="palette.success.main">
            Rs {currentActivePlan.details.interviewRate} / interview
          </Typography>
        </div>
          <Button
          variant="outlined"
          className="self-end mt-auto"
          onClick={handleOpenDialog}
        >
          Add Credits
        </Button>
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add Credits</DialogTitle>
          <Box className='border shadow-md rounded-md m-5 p-2 text-center flex justify-center'>
              <Button className="" variant="contained" onClick={()=>navigate('/topup')}>Add Credits</Button>
          </Box>


          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
      ) : (
        ""
      )}
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        Package{" "}
        <Switch
          checked={isPayAsYouGo}
          onChange={() => setIsPayAsYouGo(!isPayAsYouGo)}
        />{" "}
        Pay as you go
      </Box>
      {!isPayAsYouGo && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {packagePlans.map((plan, index) => (
            <div key={index}>
              <div className="border-blue-600 rounded-2xl border  divide-y divide-gray-200 max-w-sm mx-auto mt-20">
                <div className="p-6">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-gray-600">
                      {plan.name}
                    </h2>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500"></p>
                  <p className="mt-8">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      Rs {plan.price}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /{plan.quotaValidity}
                    </span>
                  </p>
                  <button
                    onClick={() => activatePlan(plan._id, "Package")}
                    className="flex justify-center w-full py-3 mt-4 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded active:text-indigo-500 hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring"
                  >
                    Get started now
                  </button>
                </div>
                <div className="px-6 pt-6 pb-8">
                  <h3 className="text-sm font-medium text-gray-900">
                    {" "}
                    Features
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <div className="flex justify-center items-center rounded-full bg-green-100 h-5 w-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-3 w-3 flex-shrink-0 text-green-500"
                        ></svg>
                      </div>
                      <span className="text-sm text-gray-500">
                        {plan.interviewsPerQuota} interviews included
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <div className="flex justify-center items-center rounded-full bg-green-100 h-5 w-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-3 w-3 flex-shrink-0 text-green-500"
                        ></svg>
                      </div>
                      <span className="text-sm text-gray-500">
                        Rs {plan.additionalInterviewRate} for any additional
                        Interview
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Box>
      )}
      {isPayAsYouGo && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {payAsYouGoPlans.map((plan, index) => (
            <div key={index}>
              <div className="border-blue-600 rounded-2xl border  divide-y divide-gray-200 max-w-sm mx-auto mt-20">
                <div className="p-6">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-gray-600">
                      {plan.name}
                    </h2>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500"></p>
                  <p className="mt-8">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      Interviews {plan.interviewRate}
                    </span>
                  </p>
                  <button
                    onClick={() => activatePlan(plan._id, "PayAsYouGo")}
                    className="flex justify-center w-full py-3 mt-4 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded active:text-indigo-500 hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring"
                  >
                    Get started now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Box>
      )}
    </div>
  );
}

export default Plans;
