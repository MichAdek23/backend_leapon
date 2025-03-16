import { Route, Routes } from 'react-router-dom';
import './App.css';
import MentorDashBoard from './component/MeentoDashboard/mentor-DashBoard';
import LandingPage from './component/Landing page/LandingPage';
import Mentee from './component/Mentee-onboarding/Mentee';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        
        <Route path='/mentorDashBoard' element={<MentorDashBoard />} />
        <Route path='/mentee' element={<Mentee />} /> {/* Added route for Mentee http://localhost:5173/mentee*/}
      </Routes>



    
    </div>
  );
}

export default App;