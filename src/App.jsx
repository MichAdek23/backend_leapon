import { Route, Routes } from 'react-router-dom';
import './App.css';
import MentorDashBoard from './component/MeentoDashboard/mentor-DashBoard';
import Mentee from './component/Mentee-onboarding/Mentee';
import SignUp from './component/UserAuth/register/SignUp';
import Login from './component/UserAuth/Login/Login';
import LandingPage from './component/Landing page/homecomponents/LandingPage';
import ResetPassWord from './component/UserAuth/resetPassword/resetPassword';
import GetOtp from './component/UserAuth/resetPassword/GetOtp';
import ModeOfSignUp from './component/UserAuth/ModeOfRegistring/ModeOfRegistring';
import MenteeForm from './component/UserAuth/Mentee-Form/Mentee-Form';
import Payment from './component/UserAuth/Payment';
import MentorForm from './component/UserAuth/Mentor-form/Mentor-Form';
import ChangePassword from './component/UserAuth/ChangePassword/ChangePassword';

function App() {
  return (
    <>
       <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/mentor-dashboard' element={<MentorDashBoard />} />
        <Route path='/mentee-dashboard' element={<Mentee/>}/>
        <Route path='/forgot-password' element={<ResetPassWord/>}/>  
       <Route path='/get-otp' element={<GetOtp/>}/>
       <Route path='/change-password' element={<ChangePassword/>}/>
       <Route path='/mode-of-registering' element={<ModeOfSignUp/>}/>
       <Route path='/mentee-form' element={<MenteeForm/>}/> 
       <Route path='/mentor-form' element={<MentorForm/>}/>
       <Route path='/payment' element={<Payment/>}/>
      </Routes>
    </>
  )
}

export default App;

