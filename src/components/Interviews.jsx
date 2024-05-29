import {
    Card,
    CardContent,
    CardHeader,
    Button
} from '@mui/material/';
import { toast } from 'react-toastify';


function Interviews() {
    const customerId ='66506affd07970d5e0ef86e3'
    
    const handleConsumeInterview = async () => {

        const data = {
            customerId
        };

        try {
            const response = await fetch('http://localhost:5000/api/consume-interview', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            console.log(res);
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
                <CardHeader title={"Consume Interview"} />
                <CardContent className='w-full'>
                    <Button
                        variant="contained"
                        style={{ marginTop: '10px' }}
                        onClick={handleConsumeInterview}
                    >
                        Consume Interview
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Interviews;
