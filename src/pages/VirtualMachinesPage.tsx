import React, { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { VMCard } from '../components/VMCard';
import { fetchVirtualMachines } from '../services/api';
import { AlertCircle } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

export const VirtualMachinesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [virtualMachines, setVirtualMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { vmMetrics, socket } = useWebSocket();

  useEffect(() => {
    const loadVMs = async () => {
      try {
        const vms = await fetchVirtualMachines();
        setVirtualMachines(vms);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load virtual machines');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVMs();
  }, []);
  
  const filteredVMs = useMemo(() => {
    let filtered = virtualMachines;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(vm => {
        const currentStatus = vmMetrics[vm.id]?.status || vm.status;
        return currentStatus === activeTab;
      });
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vm => 
        vm.name.toLowerCase().includes(query) || 
        vm.ipAddress.includes(query) ||
        vm.location?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeTab, searchQuery, virtualMachines, vmMetrics]);
  
  const counts = useMemo(() => {
    return {
      all: virtualMachines.length,
      running: virtualMachines.filter(vm => vmMetrics[vm.id]?.status === 'running' || (!vmMetrics[vm.id] && vm.status === 'running')).length,
      stopped: virtualMachines.filter(vm => vmMetrics[vm.id]?.status === 'stopped' || (!vmMetrics[vm.id] && vm.status === 'stopped')).length,
      error: virtualMachines.filter(vm => vmMetrics[vm.id]?.status === 'error' || (!vmMetrics[vm.id] && vm.status === 'error')).length
    };
  }, [virtualMachines, vmMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Connection Error</h2>
        </div>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
        <FilterTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredVMs.map(vm => (
          <VMCard 
            key={vm.id} 
            vm={vm} 
            metrics={vmMetrics[vm.id]}
            socket={socket}
          />
        ))}
      </div>
      
      {filteredVMs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No virtual machines found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};