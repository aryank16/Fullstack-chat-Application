import React from 'react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const quickActions = [
    "Hi! What can you help me with?",
    "What are the latest trends in frontend development?",
    "Can you help me debug a React issue?",
    "Explain TypeScript best practices",
    "How do I improve the performance of a web app?",
    "What's the best way to manage state in React?",
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</h4>
      <div className="grid grid-cols-1 gap-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onAction(action)}
            className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
