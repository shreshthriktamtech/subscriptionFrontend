import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Billing() {
    const customerId = '66506affd07970d5e0ef86e3'
    const [bills, setBills] = useState([]);

    const handleBilling = async () => {
        const data = {
            customerId
        };
        try {
            const response = await fetch('http://localhost:5000/api/billing', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
                throw new Error(`HTTP status ${response.status}`);
            }
            
            const res = await response.json();
            toast.success(res.message);
            getBills();
        } catch (error) {
            toast.error("Failed to generate bill: " + error.message);
        }
    };

    const payBill = async(invoiceId)=>{
        const data = {
            customerId: customerId,
            invoiceId
        };
        try {
            const response = await fetch('http://localhost:5000/api/pay-bill', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
                throw new Error(`HTTP status ${response.status}`);
            }
            
            const res = await response.json();
            toast.success(res.message);
            getBills();
        } catch (error) {
            toast.error("Failed to generate bill: " + error.message);
        }
    }

    const getBills = async () => {
        const data = {
            customerId
        }
        const response = await fetch('http://localhost:5000/api/bills', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        if (response.status == 200) {
            setBills(res.data)
        }
    }

    const renewPlan = async () => {
        const data = {
            customerId
        };
        try {
            const response = await fetch('http://localhost:5000/api/renew-plan', {
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
                getBills();
            } else {
                toast.error(res.message);
                getBills();
            }

        } catch (error) {
            toast.error("Failed to generate bill: " + error.message);
        }
    };

    const accountReset = async () => {
        const data = {
            customerId
        };
        try {
            const response = await fetch('http://localhost:5000/api/account-reset', {
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
            toast.error("Failed to reset Account: " + error.message);
        }
    };

    useEffect(()=>{
        getBills();
    }, []);
    


    return (
        <div>
            <Box className='border shadow-md rounded-md m-5  p-2'>
                <Button className="" variant="outlined" onClick={handleBilling}>Generate Bill</Button>
            </Box>
            <Box className='border shadow-md rounded-md m-5  p-2'>
                <Button className="" variant="outlined" onClick={renewPlan}>Renew Plan</Button>
            </Box>
            <Box className='border shadow-md rounded-md m-5  p-2'>
                <Button className="" variant="outlined" onClick={accountReset}>Reset Account</Button>
            </Box>
            
            <Box className='m-5  p-2'>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Billing Cycle</TableCell>
                            <TableCell align="right">Desciption</TableCell>
                            <TableCell align="right">Amount Due</TableCell>
                            <TableCell align="right">Tax</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bills.map((row) => (
                            <TableRow
                                key={row._id}
                            >
                                <TableCell align="right">{row.createdAt}</TableCell>
                                <TableCell align="right">-</TableCell>
                                <TableCell align="right">{row.totalPrice}</TableCell>
                                <TableCell align="right">{row.totalTax}</TableCell>
                                <TableCell align="right">{row.totalAmount}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                                <TableCell align="right">
                                {row.status=='unpaid'?
                                <Button variant="outlined" onClick={()=>payBill(row._id)}>Pay Now</Button>
                                :
                                <Button>Receipt</Button>    
                                }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </div>


    );
}

export default Billing;
