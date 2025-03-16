import React from 'react';
import Navbar from './homecomponents/Navbar'
import Hero from './homecomponents/Hero';
import Footer from './homecomponents/Footer';
import AfterHero from './homecomponents/AfterHero';
import Login from '../UserAuth/Login/Login';
import SignUp from '../UserAuth/register/SignUp';
import ResetPassWord from '../UserAuth/resetPassword/resetPassword';
import MentorDashBoard from '../MeentoDashboard/mentor-DashBoard';

function LandingPage() {
    return (
        <div className=''>
            <Navbar/>
            <Hero/>
            <AfterHero/>
            <Footer/>
        </div>

    )
};

export default LandingPage;

