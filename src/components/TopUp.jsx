import { useState } from 'react';
import {
    FormControl,
    Card,
    TextField,
    CardContent,
    CardHeader,
    Button
} from '@mui/material/';
import { toast } from 'react-toastify';


function TopUp() {
    const [amount, setAmount] = useState(0);
    const customerId ='66506affd07970d5e0ef86e3'
    
    const handleAmount = async () => {

        const data = {
            amount,
            customerId
        };

        try {
            const response = await fetch('http://localhost:5000/api/topup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (response.status === 200) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to create plan')
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card variant="outlined" className="w-96">
                <CardHeader title={"Top Up"} />
                <CardContent className='w-full'>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Enter Pay Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        style={{ marginTop: '10px' }}
                        onClick={handleAmount}
                    >
                        Top Up
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default TopUp;
