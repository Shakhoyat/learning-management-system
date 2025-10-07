import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const Messages = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">Communicate with your tutors and students</p>
            </div>

            <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
                <div className="text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600">Start a conversation with your tutors</p>
                </div>
            </div>
        </div>
    );
};

export default Messages;