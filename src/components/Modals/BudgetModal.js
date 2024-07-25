import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

function BudgetModal({ isVisible, handleCancel, onFinish }) {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Set Budget"
            visible={isVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onFinish(values);
                    form.resetFields();
                }}
            >
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
                <Form.Item
                    label="Budget"
                    name="budget"
                    rules={[{ required: true, message: 'Please input your budget!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Set Budget
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default BudgetModal;
