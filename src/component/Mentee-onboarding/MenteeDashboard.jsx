import React, { useState, useContext } from 'react';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import NavBarDashboard from '../NavBarDashboard';
import NavRes from '../NavRes';
import MenteeProfile from './MenteeProfile';
import { useAuth } from '../../lib/AuthContext';

const MenteeDashboard = () => {
  const { toggleState } = useContext(GlobalContext);
  const { user } = useAuth();
  const [activeComponent, setActiveComponent] = useState('Profile');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Profile':
        return <MenteeProfile />;
      case 'Message':
        return <div>Messages Component</div>;
      case 'Setting':
        return <div>Settings Component</div>;
      case 'Mentors':
        return <div>Mentors List Component</div>;
      case 'Sessions':
        return <div>Sessions Component</div>;
      case 'Resources':
        return <div>Resources Component</div>;
      case 'Progress':
        return <div>Progress Component</div>;
      default:
        return <MenteeProfile />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className={`${toggleState ? 'block' : 'hidden'} lg:block w-64 bg-white dark:bg-gray-800 shadow-lg`}>
        <NavBarDashboard activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {renderActiveComponent()}
        </div>
      </div>
      <div className="lg:hidden">
        <NavRes activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      </div>
    </div>
  );
};

export default MenteeDashboard; 