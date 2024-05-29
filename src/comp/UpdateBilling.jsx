import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

function UpdateBilling({ customerId }) {
    const [currentPlan, setCurrentPlan] = useState();
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState(null);

    const handleDateChange = (e) => {
        const selected = new Date(e.target.value);
        const renewal = new Date(currentPlan.renewalDate);
        
        if (selected < renewal) {
            setError("Selected date must be after the current plan's renewal date");
        } else {
            setError(null);
            setSelectedDate(e.target.value);
        }
    };

    const getCurrentPlan = async () => {
        const data = {
            customerId
        }
        const response = await fetch('http://localhost:5000/api/current-active-plan', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        console.log(res);
        if (response.status === 200) {
            setCurrentPlan(res.data.activePlan)
        }
    }

    useEffect(() => {
        getCurrentPlan()
    }, [])
    
    const handleSubmit = async() => {
        const updateBillingDate = selectedDate;
        const billingDate = currentPlan.renewalDate
        const data = {
            customerId,
            billingDate,
            updateBillingDate
        }
        const response = await fetch('http://localhost:5000/api/update-billing', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        console.log(res);
        if (response.status === 200) {
            toast.success(res.message);
        }
    };

    return (
        <div>
            {currentPlan ? (
                <Card variant="outlined">
                    <CardContent className="w-full">
                        <div>
                            Every billing date change will be effective from: {new Date(currentPlan.renewalDate).toDateString()}
                        </div>

                        <TextField
                            fullWidth
                            margin="normal"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            label="Select New Billing Date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={error !== null}
                            helperText={error}
                        />
                        <Button variant="contained" onClick={handleSubmit}>Update Billing Cycle</Button>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1">There is no current active plan</Typography>
            )}
        </div>
    );
}

export default UpdateBilling;
