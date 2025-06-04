import axios from 'axios';
import { VirtualMachine } from '../components/VMCard';

const API_BASE_URL = 'http://localhost:8090/api/vms';

export const fetchVirtualMachines = async (): Promise<VirtualMachine[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllVms`);
    return response.data.map((vm: any) => ({
      id: vm.id.toString(),
      name: vm.name,
      status: vm.status.toLowerCase(),
      ipAddress: vm.ipAddress || 'Not assigned',
      username: vm.username || 'Not assigned',
      password: vm.password || '',
      ram: vm.ram || 0,
      vcpu: vm.vcpu || 0,
      operatingSystem: vm.operatingSystem || 'Unknown',
      createdAt: vm.createdAt || new Date().toISOString(),
      edgeServerName: vm.edgeServerName || 'Unknown',
      vdiskSize: vm.vdiskSize || 0,
      cpuUsage: vm.cpuUsage || 0,
      memoryUsage: vm.memoryUsage || 0,
      installedApps: vm.installedApps || []
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Unable to reach the server. Please verify that the backend service is running at ' + API_BASE_URL);
      }
      throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
    }
    throw new Error('An unexpected error occurred while fetching virtual machines');
  }
};

export const controlVM = async (vmName: string, action: 'start' | 'stop' | 'delete') => {
  try {
    const endpoint = action === 'delete' 
      ? `${API_BASE_URL}/control/delete/${vmName}`
      : `${API_BASE_URL}/control/${vmName}/${action}`;
    
    const response = await axios[action === 'delete' ? 'delete' : 'post'](endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error(`Unable to ${action} VM. Please verify that the backend service is running.`);
      }
      throw new Error(`Failed to ${action} VM: ${error.response.status} - ${error.response.statusText}`);
    }
    throw new Error(`An unexpected error occurred while trying to ${action} the VM`);
  }
};