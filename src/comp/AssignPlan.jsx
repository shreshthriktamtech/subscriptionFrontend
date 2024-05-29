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
    FormControlLabel,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell

} from '@mui/material/';
import { toast } from 'react-toastify';

function AssignPlan({ customerId }) {
    const [mode, setMode] = useState('');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [isProRated, setIsProRated] = useState(false);
    const [proRatedEndDate, setProRatedEndDate] = useState('');
    const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

    const filteredPlans = plans.filter(plan => plan.type === mode);

    const handlePlan = (event) => {
        const selectedPlanId = event.target.value;
        const selectedPlanData = plans.find(plan => plan._id === selectedPlanId);
        setSelectedPlan(selectedPlanData || '');
    };

    const getSelectedPlanInfo = async () => {
        console.log("sa");
        const data = {
            "customerId": customerId,
            "planId": selectedPlan._id,
            "isProRated": isProRated,
            "proRatedEndDate": proRatedEndDate
        }
        console.log(data)
        const response = await fetch('http://localhost:5000/api/plan-details', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        console.log(res)
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
        console.log(res.data);
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
        getPlans();
    }, []);


    useEffect(() => {
        if (selectedPlan && mode) {
            getSelectedPlanInfo();
        }
    }, [selectedPlan, mode, isProRated, proRatedEndDate]);

    return (
        <Card variant="outlined">
            <CardHeader title={"Assign Plan to the customer"} />
            <CardContent className='w-full'>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="mode-label">Select Plan Type</InputLabel>
                    <Select
                        labelId="mode-label"
                        id="mode-select"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        label="Select Plan Type"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="Package">Package</MenuItem>
                        <MenuItem value="PayAsYouGo">PayAsYouGo</MenuItem>
                    </Select>
                </FormControl>
                {mode && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="plans-label">Select Plan</InputLabel>
                        <Select
                            labelId="plans-label"
                            id="plans-select"
                            value={selectedPlan?._id || ''}
                            onChange={handlePlan}
                            label="Select Plan"
                        >
                            {filteredPlans.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.quotaValidity} - {option.type} - {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {mode && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isProRated}
                                onChange={() => setIsProRated(!isProRated)}
                            />
                        }
                        label={mode === 'Package' ? "Is Pro Rated" : "Custom Billing Cycle"}
                    />
                )}
                {isProRated && (
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type="date"
                            value={proRatedEndDate}
                            onChange={(e) => setProRatedEndDate(e.target.value)}
                            label={mode === 'Package' ? "Pro Rated End Date" : "Next Billing Date"}
                        />
                    </FormControl>
                )}
                {selectedPlanDetails && <Box
                sx={{ border: '1px solid lightgrey', overflowX: 'auto', borderRadius: '1px' }}
                p={2}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Field</strong></TableCell>
                                <TableCell><strong>Value</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedPlanDetails && Object.keys(selectedPlanDetails).map(key => (
                                <TableRow key={key}>
                                    <TableCell component="th" scope="row">{key}</TableCell>
                                    <TableCell>{selectedPlanDetails[key]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Box>  
                }        
                <Button
                    variant="contained"
                    onClick={assignPlan}
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    disabled={!mode || !selectedPlan}
                >
                    Assign Plan to the customer
                </Button>
            </CardContent>
        </Card>
    );
}

export default AssignPlan;
