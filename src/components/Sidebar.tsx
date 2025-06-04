import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  ShoppingCart, 
  MonitorPlay, 
  Settings, 
  AppWindow,
  UserPlus,
  FileText
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarWidth = collapsed ? 'w-16' : 'w-60';

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`${sidebarWidth} transition-all duration-300 bg-blue-900 text-white flex flex-col h-full`}>
      <div className="p-4">
        <div className="flex items-center justify-center">
          {!collapsed && (
            <span className="text-xl font-bold">E</span>
          )}
          {collapsed && (
            <div className="bg-white text-blue-900 w-8 h-8 rounded flex items-center justify-center font-bold">
              E
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1">
        <SidebarItem 
          icon={<Home size={20} />} 
          label="Home" 
          active={location.pathname === '/'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/')}
        />
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={location.pathname === '/dashboard'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/dashboard')}
        />
        <SidebarItem 
          icon={<ShoppingCart size={20} />} 
          label="Catalog" 
          active={location.pathname === '/catalog'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/catalog')}
        />
        <SidebarItem 
          icon={<MonitorPlay size={20} />} 
          label="Virtual Machines" 
          active={location.pathname === '/'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/')}
        />
        <SidebarItem 
          icon={<AppWindow size={20} />} 
          label="Applications" 
          active={location.pathname === '/applications'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/applications')}
        />
        <SidebarItem 
          icon={<UserPlus size={20} />} 
          label="Provide access to Vendor" 
          active={location.pathname === '/vendor-access'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/vendor-access')}
        />
        <SidebarItem 
          icon={<FileText size={20} />} 
          label="Management of Vendor Logs" 
          active={location.pathname === '/logs'} 
          collapsed={collapsed}
          onClick={() => handleNavigation('/logs')}
        />
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, collapsed, onClick }) => {
  return (
    <div 
      className={`flex items-center px-4 py-3 ${active ? 'bg-blue-800' : 'hover:bg-blue-800'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-white">{icon}</div>
      {!collapsed && <span className="ml-3 text-sm">{label}</span>}
    </div>
  );
};