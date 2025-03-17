import { Route, Routes } from 'react-router-dom';
import './App.css';
import MentorDashBoard from './component/MeentoDashboard/mentor-DashBoard';
import Mentee from './component/Mentee-onboarding/Mentee';
import SignUp from './component/UserAuth/register/SignUp';
import Login from './component/UserAuth/Login/Login';
import LandingPage from './component/Landing page/homecomponents/LandingPage';
import ResetPassWord from './component/UserAuth/resetPassword/resetPassword';
import GetOtp from './component/UserAuth/resetPassword/GetOtp';
import ChangePassword from './component/UserAuth/ChangePassword/ChangePassword';




function App() {
  return (
    <>
       <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/mentorDashBoard' element={<MentorDashBoard />} />
        <Route path='/menteeDashBoard' element={<Mentee/>}/>
        <Route path='/forgot-password' element={<ResetPassWord/>}/>  
       <Route path='/GetOtp' element={<GetOtp/>}/>
       <Route path='/ChangePassword' element={<ChangePassword/>}/>
      </Routes>
    </>
  )
}

export default App;
 
