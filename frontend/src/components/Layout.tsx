import React from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Layout;
