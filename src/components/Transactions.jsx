import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react"

function Transactions() {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [outstandingBalance, setOutstandingBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);

    const customerId = '66506affd07970d5e0ef86e3'

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

    const getTransactions = async () => {
        const data = {
            customerId
        }
        const response = await fetch('http://localhost:5000/api/transactions', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        if (response.status == 200) {
            setTransactions(res.data)
        }
    }

    useEffect(() => {
        getBalance();
        getTransactions();
    })
    return (
        <div>
            <Box className='border shadow-md rounded-md m-5  p-2'>
                <Typography>
                    Current Balance: {currentBalance}
                </Typography>
                <Typography>
                    Outstanding Balance: {outstandingBalance}
                </Typography>
            </Box>
            <Box className='m-5  p-2'>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Base Amount</TableCell>
                                <TableCell align="right">Tax Amount</TableCell>
                                <TableCell align="right">Total Debit</TableCell>
                                <TableCell align="right">Total Credit</TableCell>
                                <TableCell align="right">Before Balance</TableCell>
                                <TableCell align="right">After Balance</TableCell>
                                <TableCell align="right">Billed/Unbilled</TableCell>
                                <TableCell align="right">Notes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((row) => (
                                <TableRow
                                    key={row._id}
                                >
                                    <TableCell component="th" scope="row">
                                        {new Date(row.date).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                    </TableCell>
                                    <TableCell align="right">{row.details.price}</TableCell>
                                    <TableCell align="right">{row.details.calculatedTax}</TableCell>
                                    <TableCell align="right">
                                        <Typography style={{ color: row.transactionType === 'debit' ? 'red' : 'inherit' }}>
                                            {row.transactionType === 'debit' ? row.details.amount : '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography style={{ color: row.transactionType === 'credit' ? 'green' : 'inherit' }}>
                                            {row.transactionType === 'credit' ? row.details.amount : '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                    <Typography style={{ 
                                        color: (row.beforeUpdateCurrentBalance === 0) ? 'inherit' :
                                               (row.beforeUpdateCurrentBalance> 0 ? 'green' : 'red')
                                        }}>
                                            {row.beforeUpdateCurrentBalance}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                    <Typography style={{ 
                                        color: (row.afterUpdateCurrentBalance === 0) ? 'inherit' :
                                               (row.afterUpdateCurrentBalance> 0 ? 'green' : 'red')
                                        }}>
                                            {row.afterUpdateCurrentBalance}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right">{row.details.note}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </div>


    );
}

export default Transactions;
