import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchVirtualMachines } from '../services/api';
import { Terminal, Search } from 'lucide-react';

export const LogManagementPage: React.FC = () => {
  const [virtualMachines, setVirtualMachines] = useState<any[]>([]);
  const [selectedVM, setSelectedVM] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { socket } = useWebSocket();
  const [logs, setLogs] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const loadVMs = async () => {
      try {
        const vms = await fetchVirtualMachines();
        setVirtualMachines(vms);
        if (vms.length > 0) {
          setSelectedVM(vms[0].name);
        }
      } catch (error) {
        console.error('Failed to load VMs:', error);
      }
    };
    loadVMs();
  }, []);

  useEffect(() => {
    if (!socket || !selectedVM) return;

    socket.emit('requestLogs', selectedVM);

    socket.on('vmLogs', (data: { vmName: string; log: string }) => {
      if (data.vmName === selectedVM) {
        setLogs(prev => ({
          ...prev,
          [selectedVM]: [...(prev[selectedVM] || []), data.log]
        }));
      }
    });

    return () => {
      socket.off('vmLogs');
    };
  }, [socket, selectedVM]);

  const filteredVMs = virtualMachines.filter(vm =>
    vm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentLogs = logs[selectedVM || ''] || [];
  const filteredLogs = searchQuery
    ? currentLogs.filter(log => log.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentLogs;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Log Management</h1>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search logs or VMs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Virtual Machines</h2>
          <div className="space-y-2">
            {filteredVMs.map(vm => (
              <button
                key={vm.id}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  selectedVM === vm.name
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setSelectedVM(vm.name)}
              >
                <div className="flex items-center">
                  <Terminal size={16} className="mr-2" />
                  <span>{vm.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              {selectedVM ? `Logs: ${selectedVM}` : 'Select a VM to view logs'}
            </h2>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg h-[calc(100vh-300px)] overflow-y-auto font-mono text-sm">
              {selectedVM ? (
                filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap py-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No logs available...</div>
                )
              ) : (
                <div className="text-gray-500">Select a virtual machine to view its logs</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};