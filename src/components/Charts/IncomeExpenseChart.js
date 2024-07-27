import React from 'react';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

ChartJs.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController,
);

function IncomeExpenseChart({ incomes, expenses }) {
    const labels = [...new Set([...incomes, ...expenses].map((transaction) => moment(transaction.date).format('YYYY-MM-DD')))];
    labels.sort((a, b) => new Date(a) - new Date(b));

    const incomeData = labels.map(label => {
        const income = incomes.find(inc => moment(inc.date).format('YYYY-MM-DD') === label);
        return income ? income.amount : 0;
    });

    const expenseData = labels.map(label => {
        const expense = expenses.find(exp => moment(exp.date).format('YYYY-MM-DD') === label);
        return expense ? expense.amount : 0;
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Expense',
                data: expenseData,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                tension: 0.3,
            }
        ]
    };

    return <Line data={data} />;
}

export default IncomeExpenseChart;
