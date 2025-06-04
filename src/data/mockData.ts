import { VirtualMachine } from '../components/VMCard';

export const mockVirtualMachines: VirtualMachine[] = [
  {
    id: '1',
    name: 'VM-Production-1',
    status: 'running',
    ipAddress: '192.168.1.101',
    location: 'US East',
    vCPU: 4,
    ssdSize: 200,
    ramSize: 8,
    cpuUsage: 13,
    memoryUsage: 40,
    installedApps: [
      { name: 'Analytics Dashboard' },
      { name: 'Security Monitor' },
    ]
  },
  {
    id: '2',
    name: 'VM-Production-2',
    status: 'running',
    ipAddress: '192.168.1.102',
    location: 'US West',
    vCPU: 8,
    ssdSize: 500,
    ramSize: 16,
    cpuUsage: 58,
    memoryUsage: 30,
    installedApps: [
      { name: 'Content Management System' },
    ]
  },
  {
    id: '3',
    name: 'VM-Development',
    status: 'stopped',
    ipAddress: '192.168.1.104',
    location: 'Asia East',
    vCPU: 2,
    ssdSize: 100,
    ramSize: 4,
    cpuUsage: 0,
    memoryUsage: 0,
    installedApps: []
  },
  {
    id: '4',
    name: 'VM-Staging',
    status: 'provisioning',
    ipAddress: '192.168.1.106',
    location: 'Europe Central',
    vCPU: 4,
    ssdSize: 250,
    ramSize: 8,
    cpuUsage: 0,
    memoryUsage: 0,
    installedApps: []
  }
];