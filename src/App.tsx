import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VirtualMachinesPage } from './pages/VirtualMachinesPage';
import { LogManagementPage } from './pages/LogManagementPage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Industrial Edge Management" 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Routes>
          <Route path="/" element={<VirtualMachinesPage />} />
          
          <Route path="/logs" element={<LogManagementPage />} />   {/* ← this line */}
          {/* any other routes */}
        </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;