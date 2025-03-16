import { Route, Routes } from 'react-router-dom';
import './App.css';
import MentorDashBoard from './component/MeentoDashboard/mentor-DashBoard';
import Hero from './component/Landing page/homecomponents/Hero';
import Mentee from './component/Mentee-onboarding/Mentee';
import SignUp from './component/UserAuth/register/SignUp';
import Login from './component/UserAuth/Login/Login';
import LandingPage from './component/Landing page/homecomponents/LandingPage';



function App() {
  return (
    <>
       <Routes>
       <Route path='/' element={<LandingPage/>} />
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/mentorDashBoard' element={<MentorDashBoard />} />
        <Route path='/menteeDashBoard' element={<Mentee/>}/>
        
      </Routes>
    </>
  )
}

export default App;
 
