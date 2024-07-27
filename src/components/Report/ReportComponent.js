import React from 'react';
import { Table, Button } from 'antd';
import { Line } from '@ant-design/charts';
import Papa from 'papaparse';
import "./styles.css"

function ReportComponent({ transactions }) {
    const incomeData = transactions.filter(transaction => transaction.type === "income");
    const expenseData = transactions.filter(transaction => transaction.type === "expense");

    const totalIncome = incomeData.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = expenseData.reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = totalIncome - totalExpenses;

    const data = transactions.map((transaction) => ({
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type === 'income' ? 'Income' : 'Expense',
    }));

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
    ];

    const lineConfig = {
        data,
        xField: 'date',
        yField: 'amount',
        seriesField: 'type',
        color: ({ type }) => (type === 'Income' ? '#4caf50' : '#f44336'),
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`,
            },
        },
        legend: {
            position: 'top',
        },
        tooltip: {
            showMarkers: true,
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    function exportCSV() {
        var csv = Papa.unparse({
            fields: ["date", "type", "amount"],
            data: transactions,
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "report.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="report-wrapper">
            <h1>Transaction Report</h1>
            <div className="summary">
                <p>Total Income: ${totalIncome.toFixed(2)}</p>
                <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
                <p>Balance: ${balance.toFixed(2)}</p>
            </div>
            <div className="chart">
                <Line {...lineConfig} />
            </div>
            <div className="transaction-table">
                <Table dataSource={transactions} columns={columns} />
            </div>
            <Button type="primary" onClick={exportCSV}>
                Export Report to CSV
            </Button>
        </div>
    );
}

export default ReportComponent;
