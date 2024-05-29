import { useState } from 'react';
import {
    FormControl,
    Card,
    TextField,
    CardContent,
    CardHeader,
    Button,
    Select,
    MenuItem,
    InputLabel,
    Switch
} from '@mui/material/';
import { toast } from 'react-toastify';


function CreatePlan() {
    const [packageName, setPackageName] = useState('');
    const [packagePrice, setPackagePrice] = useState(0);
    const [interviewRate, setInterviewRate] = useState(0);
    const [additionalInterviewRate, setAdditionalInterviewRate] = useState(0);
    const [quotaValidity, setQuotaValidity] = useState('monthly');
    const [interviewsPerQuota, setInterviewsPerQuota] = useState(0);
    const [errors, setErrors] = useState({});
    const [isPayAsYouGo, setIsPayAsYouGo] = useState(false);

    const validateForm = () => {
        let tempErrors = {};
        if (!packageName) tempErrors.packageName = 'Package name is required';
        if (isPayAsYouGo) {
            if (!interviewRate) tempErrors.interviewRate = 'Interview Rate is required';
        } else {
            if (!packagePrice) tempErrors.packagePrice = 'Package price is required';
            if (!additionalInterviewRate) tempErrors.additionalInterviewRate = 'Additional interview rate is required';
            if (!interviewsPerQuota) tempErrors.interviewsPerQuota = 'Interviews per quota is required';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    
    const handleCreatePlan = async () => {
        if (!validateForm()) return;
    
        const data = {
            name: packageName,
            type: isPayAsYouGo ? 'PayAsYouGo' : 'Package',
            price: isPayAsYouGo ? null : packagePrice,
            interviewRate: isPayAsYouGo ? interviewRate : null,
            additionalInterviewRate: isPayAsYouGo ? null : additionalInterviewRate,
            quotaValidity: isPayAsYouGo ? null : quotaValidity,
            interviewsPerQuota: isPayAsYouGo ? null : interviewsPerQuota
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/create-plan', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const res = await response.json();
            if (response.status === 201) {
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
                <CardHeader title={"Create Plans"} />
                <CardContent className='w-full'>
                    Package <Switch checked={isPayAsYouGo} onChange={() => setIsPayAsYouGo(!isPayAsYouGo)} /> Pay as you go
                    {/* Each TextField and Select will now show errors if they exist in the errors object */}
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Package Name"
                            type="text"
                            error={!!errors.packageName}
                            helperText={errors.packageName}
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                        />
                    </FormControl>
                    {!isPayAsYouGo &&
                        <div>
                            <FormControl fullWidth margin="normal">
                            <TextField
                                label="Package Price"
                                type="number"
                                error={!!errors.packagePrice}
                                helperText={errors.packagePrice}
                                value={packagePrice}
                                onChange={(e) => setPackagePrice(e.target.value)}
                            />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                            <TextField
                                label="Additional Interview Rate"
                                type="number"
                                error={!!errors.additionalInterviewRate}
                                helperText={errors.additionalInterviewRate}
                                value={additionalInterviewRate}
                                onChange={(e) => setAdditionalInterviewRate(e.target.value)}
                            />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="quota-validity-label">Quota Validity</InputLabel>
                                <Select
                                    labelId="quota-validity-label"
                                    id="quota-validity-select"
                                    value={quotaValidity}
                                    label="Quota Validity"
                                    onChange={(e) => setQuotaValidity(e.target.value)}
                                >
                                    <MenuItem value={'monthly'}>Monthly</MenuItem>
                                    <MenuItem value={'yearly'}>Yearly</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Interviews Per Quota"
                                    type="number"
                                    error={!!errors.interviewsPerQuota}
                                    helperText={errors.interviewsPerQuota}
                                    value={interviewsPerQuota}
                                    onChange={(e) => setInterviewsPerQuota(e.target.value)}
                                />
                            </FormControl>
                        </div>
                    }
                    {
                        isPayAsYouGo && 
                        <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Interviews Rate"
                                    type="number"
                                    error={!!errors.interviewRate}
                                    helperText={errors.interviewRate}
                                    value={interviewRate}
                                    onChange={(e) => setInterviewRate(e.target.value)}
                                />
                            </FormControl>
                    }
                    
                    <Button
                        variant="contained"
                        style={{ marginTop: '10px' }}
                        onClick={handleCreatePlan}
                    >
                        Create Plan
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreatePlan;
