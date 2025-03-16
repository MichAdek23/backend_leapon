import { Route, Routes } from 'react-router-dom';
import './App.css';
import MentorDashBoard from './component/MeentoDashboard/mentor-DashBoard';
import LandingPage from './component/Landing page/LandingPage';

import Mentee from './component/Mentee-onboarding/Mentee';
import Hero from './component/Landing page/homecomponents/Hero';



function App() {
  return (
    <>
       <Routes>
        <Route path='/mentorDashBoard' element={<MentorDashBoard />} />
        <Route path='/' element={<Hero/>} />

      </Routes>
    </>
  )
}

export default App;
 
