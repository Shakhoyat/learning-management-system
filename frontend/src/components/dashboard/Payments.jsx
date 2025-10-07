import React from 'react';
import { CreditCardIcon, ReceiptRefundIcon } from '@heroicons/react/24/outline';

const Payments = () => {
    const transactions = [
        {
            id: 1,
            type: 'payment',
            description: 'React Advanced Patterns session with Sarah Johnson',
            amount: 75,
            date: '2025-01-08',
            status: 'completed'
        },
        {
            id: 2,
            type: 'payment',
            description: 'Node.js API Development session with Michael Chen',
            amount: 120,
            date: '2025-01-07',
            status: 'completed'
        },
        {
            id: 3,
            type: 'refund',
            description: 'Cancelled session refund',
            amount: 65,
            date: '2025-01-06',
            status: 'completed'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
                <p className="text-gray-600">Manage your payment history and methods</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCardIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900">$1,240</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ReceiptRefundIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">This Month</p>
                            <p className="text-2xl font-bold text-gray-900">$195</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <CreditCardIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Saved</p>
                            <p className="text-2xl font-bold text-gray-900">$325</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {transactions.map(transaction => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${transaction.type === 'payment' ? 'bg-red-100' : 'bg-green-100'
                                        }`}>
                                        <CreditCardIcon className={`h-5 w-5 ${transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{transaction.description}</p>
                                        <p className="text-sm text-gray-600">{transaction.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                        {transaction.type === 'payment' ? '-' : '+'}${transaction.amount}
                                    </p>
                                    <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;