
import React from 'react';
import { Line, Pie } from '@ant-design/charts';
import "./styles.css"

function ChartComponent({ sortedTransactions }) {
    const data = sortedTransactions.map((transaction) => ({
        date: transaction.date,
        amount: transaction.amount,
    }));

    let spendingData = sortedTransactions
        .filter(transaction => transaction.type === "expense")
        .map(transaction => ({ tag: transaction.tag, amount: transaction.amount }));

    let finalSpendings = spendingData.reduce((acc, obj) => {
        let key = obj.tag;
        if (!acc[key]) {
            acc[key] = { tag: obj.tag, amount: 0 }; // Create a new object with same properties
        }
        acc[key].amount += obj.amount;
        return acc;
    }, {});

    let newSpendings = Object.values(finalSpendings);

    const lineConfig = {
        data,
        width: 800,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
        point: {
            size: 10,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };

    const pieConfig = {
        data: newSpendings,
        width: 500,
        angleField: "amount",
        colorField: "tag",
    };

    let chart;
    let pieChart;

    return (
        <div className="charts-wrapper">
            <div>
                <h1>Your Analytics</h1>
                <Line {...lineConfig} onReady={(chartInstance) => (chart = chartInstance)} />
            </div>
            <div>
                <h1>Your Spendings</h1>
                <Pie {...pieConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
            </div>
        </div>
    );
}

export default ChartComponent;



