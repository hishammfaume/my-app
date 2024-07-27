import React, { useState } from 'react';
import { Modal, Table, Divider, Button, Select, DatePicker } from 'antd';
import Papa from 'papaparse';
import moment from 'moment';
import IncomeExpenseChart from '../Charts/IncomeExpenseChart'; // Import the new chart component
import { Line } from '@ant-design/charts';


const { Option } = Select;
const { MonthPicker } = DatePicker;

function ReportModal({ isVisible, handleCancel, transactions, budgets }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const filterTransactions = (transactions) => {
    return transactions.filter((transaction) => {
      const transactionMonth = moment(transaction.date).format('YYYY-MM');
      const matchesMonth = selectedMonth ? transactionMonth === selectedMonth.format('YYYY-MM') : true;
      const matchesTag = selectedTag ? transaction.tag === selectedTag : true;
      return matchesMonth && matchesTag;
    });
  };

  const filteredTransactions = filterTransactions(transactions);

  const groupByCategory = (transactions) => {
    const grouped = {};
    transactions.forEach((transaction) => {
      const category = transaction.tag;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(transaction);
    });
    return grouped;
  };

  const groupedByCategory = groupByCategory(filteredTransactions);

  const categoryData = Object.keys(groupedByCategory).map((category) => {
    const categoryTransactions = groupedByCategory[category];
    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const budget = budgets[category] || 0;
    return { category, totalAmount, budget };
  });

  const topExpenseCategories = categoryData
    .filter((d) => d.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  const exceededBudgetsData = categoryData.filter((d) => d.totalAmount > d.budget);

  const incomes = filteredTransactions.filter(transaction => transaction.type === 'income');
  const expenses = filteredTransactions.filter(transaction => transaction.type === 'expense');

  const recurringExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const key = t.tag;
      if (!acc[key]) {
        acc[key] = { ...t, count: 1 };
      } else {
        acc[key].amount += t.amount;
        acc[key].count += 1;
      }
      return acc;
    }, {});

  const recurringExpensesData = Object.values(recurringExpenses).filter((t) => t.count > 1);

  const trendData = transactions
    .filter((t) => t.type === 'expense')
    .map((t) => ({
      date: moment(t.date).format('YYYY-MM'),
      amount: t.amount,
    }))
    .reduce((acc, t) => {
      if (!acc[t.date]) {
        acc[t.date] = { date: t.date, amount: 0 };
      }
      acc[t.date].amount += t.amount;
      return acc;
    }, {});

  const trendChartData = Object.values(trendData);

  const exportCSV = () => {
    const dataToExport = filteredTransactions.map((transaction) => ({
      date: transaction.date,
      name: transaction.name,
      type: transaction.type,
      amount: transaction.amount,
      tag: transaction.tag,
      category: transaction.tag, // Include the category as a separate column
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      title="Transaction Report"
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="export" type="primary" onClick={exportCSV}>
          Export to CSV
        </Button>,
      ]}
      width="90%"
    >
      <div style={{ marginBottom: '20px' }}>
        <Select
          placeholder="Select a tag"
          style={{ width: 200, marginRight: '10px' }}
          onChange={(value) => setSelectedTag(value)}
          allowClear
        >
          <Option value={null}>All</Option>
          {Array.from(new Set(transactions.map(t => t.tag))).map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
        <MonthPicker
          placeholder="Select a month"
          onChange={(date) => setSelectedMonth(date)}
          format="YYYY-MM"
          allowClear
        />
      </div>

      <Divider>Budget vs. Actual Report</Divider>
      <Table dataSource={categoryData} columns={[
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount' },
        { title: 'Budget', dataIndex: 'budget', key: 'budget' },
      ]} pagination={false} />

      <Divider>Top Expense Categories Report</Divider>
      <Table dataSource={topExpenseCategories} columns={[
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount' },
      ]} pagination={false} />

      <Divider>Transaction Summary Report</Divider>
      <Table dataSource={filteredTransactions} columns={[
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Tag', dataIndex: 'tag', key: 'tag' },
      ]} pagination={false} />

      <Divider>Recurring Expenses Report</Divider>
      <Table dataSource={recurringExpensesData} columns={[
        { title: 'Tag', dataIndex: 'tag', key: 'tag' },
        { title: 'Total Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Count', dataIndex: 'count', key: 'count' },
      ]} pagination={false} />

      <Divider>Expense Trend Analysis</Divider>
      <Line data={trendChartData} xField='date' yField='amount' point={{ size: 5, shape: 'diamond' }} />

      <Divider>Income vs. Expense Report</Divider>
      <IncomeExpenseChart incomes={incomes} expenses={expenses} />
    </Modal>
  );
}

export default ReportModal;


