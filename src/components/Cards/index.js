import React from 'react';
import './styles.css';
import { Card, Row, Modal } from 'antd';
import Button from '../Button';

function Cards({ income, expense, totalBalance, showExpenseModal, showIncomeModal, resetBalance }) {
    const confirmResetBalance = () => {
        Modal.confirm({
            title: 'Confirm Reset',
            content: 'Are you sure you want to reset the balance? This action cannot be undone.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: resetBalance,
        });
    };

    return (
        <div>
            <Row className='my-row'>
                <Card bordered={true} className='my-card' title='Current Balance'>
                    <p>{totalBalance}</p>
                    <Button text="Reset Balance" onClick={confirmResetBalance} />
                </Card>
                <Card bordered={true} className='my-card' title='Total Income'>
                    <p>{income}</p>
                    <Button text="Add Income" onClick={showIncomeModal} />
                </Card>
                <Card bordered={true} className='my-card' title='Total Expenses'>
                    <p>{expense}</p>
                    <Button text="Add Expense" onClick={showExpenseModal} />
                </Card>
            </Row>
        </div>
    );
}

export default Cards;
