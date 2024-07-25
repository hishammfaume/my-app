import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;

function RecurringTransactionModal({ isVisible, handleCancel, onFinish }) {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Add Recurring Transaction"
            visible={isVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onFinish({
                        ...values,
                        type: 'expense',  // Set the type to 'expense'
                        startDate: values.startDate.format("YYYY-MM-DD"),
                    });
                    form.resetFields();
                }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the name of the transaction!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input the amount!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: 'Please select the start date!' }]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current && current < moment().endOf('day')}
                    />
                </Form.Item>
                <Form.Item
                    label="Frequency"
                    name="frequency"
                    rules={[{ required: true, message: 'Please select the frequency!' }]}
                >
                    <Select>
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="yearly">Yearly</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Expense Type"
                    name="expenseType"
                    rules={[{ required: true, message: 'Please select the expense type!' }]}
                >
                    <Select>
                        <Option value="benefits and insurance">Benefits and Insurance</Option>
                        <Option value="medical supplies and equipment">Medical Supplies and Equipment</Option>
                        <Option value="salaries and wages">Salaries and Wages</Option>
                        <Option value="pharmaceuticals">Pharmaceuticals</Option>
                        <Option value="rent">Rent</Option>
                        <Option value="administrative costs">Administrative Costs</Option>
                        <Option value="facility expenses">Facility Expenses</Option>
                        <Option value="others">Others</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Recurring Transaction
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RecurringTransactionModal;
