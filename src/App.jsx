import { Route, Routes } from 'react-router-dom';
import './App.css';
import MentorDashBoard from './component/MeentoDashboard/mentor-DashBoard';
import LandingPage from './component/Landing page/LandingPage';


function App() {
  return (
      <Routes>
        <Route path='/MentorDashBoard' element={<MentorDashBoard />} />
        <Route path='/' element={<LandingPage/>} />
      </Routes>
  );
}

export default App;
 