import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner, faCheckCircle, faExclamationCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { userApi } from '../../lib/api';

function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [success, setSuccess] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.email) {
      setUserEmail(userData.email);
    }

    // Check for verification status in URL
    const status = searchParams.get('status');
    if (status === 'success') {
      setVerificationStatus('success');
      setSuccess('Email verified successfully! Redirecting...');
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === 'mentor') {
          navigate('/mentor-form');
        } else if (userData.role === 'mentee') {
          navigate('/mentee-form');
        } else {
          navigate('/mode-of-registering');
        }
      }, 2000);
    } else if (status === 'error') {
      setVerificationStatus('error');
      setError('Verification failed. Please try again or request a new verification email.');
    }

    let timer;
    if (countdown > 0 && resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown, resendDisabled, searchParams, navigate]);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (!userEmail) {
        throw new Error('User email not found');
      }

      await userApi.sendVerificationEmail(userEmail);
      setSuccess('Verification email sent successfully!');
      setResendDisabled(true);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await userApi.checkVerificationStatus();
      
      if (response.verified) {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        setVerificationStatus('success');
        setSuccess('Email verified successfully! Redirecting...');
        
        // Redirect based on role
        setTimeout(() => {
          if (userData.role === 'mentor') {
            navigate('/mentor-form');
          } else if (userData.role === 'mentee') {
            navigate('/mentee-form');
          } else {
            navigate('/mode-of-registering');
          }
        }, 2000);
      } else {
        setError('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="relative flex h-full">
      <div className="hidden  relative  lg:block h-full w-3/5">
        {/* <img
          src="/public/image/logo.png.png"
          className="h-20   absolute top-4 left-8 w-20  object-cover"
          alt="Email Verification"
        /> */}
        <div onClick={() => navigate('/')} className="  w-full h-full ">
          <img src="/image/close-up-people-learning-together-office 1.png" className="w-full h-full object-cover" alt="Logo" />
        </div>
      </div>

      <div className="flex items-center w-full lg:w-2/5 justify-center">
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </button>

          <h1 className="text-2xl font-bold lg:text-[40px] text-customDarkBlue">Verify Your Email</h1>
          <p className="text-slate-400 text-sm mt-2">
            We've sent a verification link to <span className="font-semibold text-gray-700">{userEmail}</span>. 
            Please check your inbox and click the link to verify your account.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FontAwesomeIcon icon={faExclamationCircle} />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} />
              {success}
            </div>
          )}

          {verificationStatus === 'success' ? (
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-600" />
              </div>
              <p className="text-center text-gray-600">
                Your email has been verified successfully! Redirecting...
              </p>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-customOrange" />
              </div>
              
              <p className="text-center text-gray-600 mb-6">
                Didn't receive the email? Check your spam folder or try resending.
              </p>

              <button
                onClick={handleResendEmail}
                disabled={resendDisabled || loading}
                className={`w-full py-3 rounded-lg text-white ${
                  resendDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-customOrange hover:bg-orange-600'
                } transition-colors mb-4 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <>
                    Resend Email {resendDisabled && `(${countdown}s)`}
                  </>
                )}
              </button>

              <button
                onClick={handleCheckVerification}
                disabled={loading}
                className="w-full py-3 rounded-lg text-white bg-customOrange hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  "I've Verified My Email"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EmailVerification; 