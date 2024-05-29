import { useEffect, useState } from 'react';
import {
    FormControl,
    Card,
    TextField,
    CardContent,
    CardHeader,
    Button,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    FormGroup,
    FormControlLabel,
    Box
} from '@mui/material/';
import { toast } from 'react-toastify';

function AssignPlan() {
    const customerId = '66506affd07970d5e0ef86e3'
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [mode, setMode] = useState('Package');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [isProRated, setIsProRated] = useState(false);
    const [proRatedEndDate, setProRatedEndDate] = useState('');
    const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

    const filteredPlans = plans.filter(plan => plan.type === mode);

    const handleCustomer = (event) => setSelectedCustomer(event.target.value);

    const handlePlan = (event) => {
        const selectedPlanId = event.target.value;
        const selectedPlanData = plans.find(plan => plan._id === selectedPlanId);
        setSelectedPlan(selectedPlanData || '');
    };

    const getCustomers = async () => {
        const response = await fetch('http://localhost:5000/api/customers', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const res = await response.json();
        if (response.status === 200) {
            setCustomers(res.data);
        }
    }

    const getSelectedPlanInfo = async () => {
            const data = {
                "customerId": customerId,
                "plan_id": selectedPlan._id,
                "isProRated": isProRated,
                "proRatedEndDate": proRatedEndDate
            }
            const response = await fetch('http://localhost:5000/api/plan-details', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const res = await response.json();
            console.log(res);
            if (response.status === 200) {
                setSelectedPlanDetails(res.data);
            }
    }

    const getPlans = async () => {
        const response = await fetch('http://localhost:5000/api/plans', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const res = await response.json();
        setPlans(res.data);
    }

    const assignPlan = async () => {
        const data = {
            'customerId': customerId,
            'planId': selectedPlan._id,
            'transaction_type': mode,
            'isProRated': isProRated,
            'proRatedEndDate': proRatedEndDate,
        };

        const response = await fetch('http://localhost:5000/api/assign-plan', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const res = await response.json();
        if (response.status === 200) {
            toast.success(res.message)
        } else {
            toast.error(res.message);
        }
    }

    useEffect(() => {
        getCustomers();
        getPlans();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <Card variant="outlined" className="w-96">
                <CardHeader title={"Assign Plan"} />
                <CardContent className='w-full'>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="customers-label">Select Customers</InputLabel>
                        <Select
                            labelId="customers-label"
                            id="customers-select"
                            value={selectedCustomer}
                            onChange={handleCustomer}
                            label="Select Customers"
                        >
                            {customers.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="mode-label">Select Plan Type</InputLabel>
                        <Select
                            labelId="mode-label"
                            id="mode-select"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            label="Select Mode"
                        >
                            <MenuItem value="Package">Package</MenuItem>
                            <MenuItem value="PayAsYouGo">PayAsYouGo</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="plans-label">Select Plans</InputLabel>
                        <Select
                            labelId="plans-label"
                            id="plans-select"
                            value={selectedPlan?._id || ''}
                            onChange={handlePlan}
                            label="Select Plans"
                        >
                            {filteredPlans.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.quotaValidity} - {option.type} - {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isProRated}
                                onChange={() => setIsProRated(!isProRated)}
                            />
                        }
                        label="Pro Rated Packages"
                    />
                    {isProRated &&
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type="date"
                                value={proRatedEndDate}
                                onChange={(e) => setProRatedEndDate(e.target.value)}
                            />
                        </FormControl>
                    }
                    {selectedPlanDetails &&
                        <Box
                            sx={{ border: '2px solid grey' }}
                            gap={4}
                            p={2}>
                            <b>Selected Plan Details</b>
                            <div><b>Plan ID:</b> {selectedPlanDetails._id}</div>
                            <div><b>Name:</b> {selectedPlanDetails.name}</div>
                            <div><b>Price:</b> {selectedPlanDetails.price}</div>
                            <div><b>Validity:</b> {selectedPlanDetails.quotaValidity}</div>
                        </Box>
                    }
                    <Button
                        variant="contained"
                        onClick={assignPlan}
                        style={{ marginTop: '10px', marginLeft: '10px' }}
                    >
                        Assign Package
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default AssignPlan;
