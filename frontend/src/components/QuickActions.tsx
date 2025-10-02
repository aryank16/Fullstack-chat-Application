import React from 'react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const quickActions = [
    "Hallo! Wie kann ich dir helfen?",
    "Was sind die neuesten Trends im Frontend Development?",
    "Kannst du mir bei einem React Problem helfen?",
    "Erkläre mir TypeScript Best Practices",
    "Wie optimiere ich die Performance einer Web App?",
    "Was ist der beste Weg, um State zu verwalten?",
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
