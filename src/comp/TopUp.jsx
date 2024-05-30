import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

function Topup({ customerId }) {
    const [amount, setAmount] = useState(0);


    const handleSubmit = async() => {
        const data = {
            customerId,
            amount,
        }
        const response = await fetch('http://localhost:5000/api//promo-topup', {
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
        else{
            toast.error(res.message);
        }
    };

    return (
        <div>
            <Card variant="outlined">
                <CardContent className="w-full">
                    <TextField
                        fullWidth
                        margin="normal"
                        type="number"
                        value={amount}
                        onChange={(e)=>setAmount(e.target.value)}
                        label="Provide user a bonus"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button variant="contained" onClick={handleSubmit}>Add Bonus</Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Topup;
