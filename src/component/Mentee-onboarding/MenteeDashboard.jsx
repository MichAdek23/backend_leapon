import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { GlobalContext } from '@/component/GlobalStore/GlobalState';
// import NavBarDashboard from '../NavBarDashboard';
import NavRes from '../NavRes';
import MenteeProfile from './MenteeProfile';
import Setting from '../MeentoDashboard/MenteePages/Setting';
import { useAuth } from '../../lib/AuthContext';

const MenteeDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Profile');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Profile':
        return <MenteeProfile />;
      case 'Message':
        return <div>Messages Component</div>;
      case 'Setting':
        return <Setting />;
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
    <div className="flex">
      <div className="hidden lg:block">
        {/* <NavBarDashboard activeComponent={activeComponent} setActiveComponent={setActiveComponent} /> */}
      </div>
      <div className="lg:hidden">
        <NavRes activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      </div>
      <div className="flex-1">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default MenteeDashboard; 