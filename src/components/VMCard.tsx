import React from 'react';
import { 
  Square, 
  MonitorSmartphone, 
  Cpu, 
  HardDrive, 
  Database,
  StopCircle, 
  Settings, 
  Trash2,
  Play,
  User,
  Calendar,
  Server
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ResourceBar } from './ResourceBar';
import { controlVM } from '../services/api';

export interface InstalledApp {
  name: string;
}

export interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'provisioning';
  ipAddress: string;
  username: string;
  password: string;
  ram: number;
  vcpu: number;
  operatingSystem: string;
  createdAt: string;
  edgeServerName: string;
  vdiskSize: number;
  cpuUsage: number;
  memoryUsage: number;
  installedApps: InstalledApp[];
}

interface VMCardProps {
  vm: VirtualMachine;
  metrics?: {
    cpuUsage: number;
    memoryUsage: number;
    status: string;
  };
}

export const VMCard: React.FC<VMCardProps> = ({ vm, metrics }) => {
  const handleAction = async (action: 'start' | 'stop' | 'delete') => {
    try {
      await controlVM(vm.name, action);
    } catch (error) {
      console.error(`Failed to ${action} VM:`, error);
    }
  };

  const status = metrics?.status || vm.status;
  const cpuUsage = metrics?.cpuUsage ?? vm.cpuUsage;
  const memoryUsage = metrics?.memoryUsage ?? vm.memoryUsage;

  const borderColor = () => {
    switch (status) {
      case 'running':
        return 'border-t-4 border-t-green-500';
      case 'stopped':
        return 'border-t-4 border-t-red-500';
      case 'provisioning':
        return 'border-t-4 border-t-yellow-500';
      default:
        return 'border-t-4 border-t-gray-300';
    }
  };

  const ActionButton = (
    status === 'running' ? (
      <button 
        onClick={() => handleAction('stop')}
        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
      >
        <StopCircle size={18} className="mr-1" />
        <span className="text-sm">Stop</span>
      </button>
    ) : status === 'stopped' || status === 'error' ? (
      <button 
        onClick={() => handleAction('start')}
        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
      >
        <Play size={18} className="mr-1" />
        <span className="text-sm">Run</span>
      </button>
    ) : (
      <button 
        disabled
        className="flex items-center px-3 py-2 text-gray-400 cursor-not-allowed rounded transition"
      >
        <StopCircle size={18} className="mr-1" />
        <span className="text-sm">Stop</span>
      </button>
    )
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow ${borderColor()} transition-all duration-200 hover:shadow-md`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Square size={20} className="text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">{vm.name}</h3>
          </div>
          <StatusBadge status={status} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MonitorSmartphone size={16} className="mr-1" /> 
            <span>{vm.ipAddress}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User size={16} className="mr-1" /> 
            <span>{vm.username}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Server size={16} className="mr-1" /> 
            <span>{vm.edgeServerName}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-1" /> 
            <span>{formatDate(vm.createdAt)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Cpu size={16} className="mr-1" /> 
            <span>{vm.vcpu} vCPU</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Database size={16} className="mr-1" /> 
            <span>{vm.ram} MB RAM</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <HardDrive size={16} className="mr-1" /> 
            <span>{vm.vdiskSize} GB</span>
          </div>
        </div>
        
        <ResourceBar label="CPU" percentage={cpuUsage} />
        <ResourceBar label="Memory" percentage={memoryUsage} />
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Operating System
          </h4>
          <div className="text-sm text-gray-600">{vm.operatingSystem}</div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-3 flex justify-between">
        {ActionButton}
        
        <div className="flex">
          <button onClick={()=> handleAction('start')}className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
            <Settings size={18} className="mr-1" />
            <span className="text-sm">Start</span>
          </button>
          
          <button 
            onClick={() => handleAction('delete')}
            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded transition ml-2"
          >
            <Trash2 size={18} className="mr-1" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};