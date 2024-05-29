import { Box, Button, Card, CardContent, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

function DeactivateCustomer({customerId}) {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [outstandingBalance, setOutstandingBalance] = useState(0);

    const getBalance = async () => {
        const data = {
            customerId
        }
        const response = await fetch('http://localhost:5000/api/customer-details', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        if (response.status == 200) {
            setCurrentBalance(res.data.currentBalance);
            setOutstandingBalance(res.data.outstandingBalance);
        }
    }


    const handleDeactivate = async () => {
        const data = {
            customerId
        }
        const response = await fetch('http://localhost:5000/api/deactivate', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        if (response.status == 200) {
            toast.success(res.message)
        }
        else{
            toast.error(res.message)
        }
    }



    useEffect(() => {
        getBalance();
    })
    return (
        <div>
            <Card variant="outlined">
                <CardContent className='w-full'>
                    <Typography>
                        Current Balance: {currentBalance}
                    </Typography>
                    <Typography>
                        Outstanding Balance: {outstandingBalance}
                    </Typography>

                    Are you sure you  want to deactivate this account ?
                    <div>
                        <Button variant="outlined" onClick={handleDeactivate}>Deactivate</Button>
                    </div>
                    
                </CardContent>
            </Card>
        </div>
    );
}

export default DeactivateCustomer;
