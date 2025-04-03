import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../lib/api';

function SignIn() {
  const [passwordType, setPasswordType] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Toggle password visibility
  const handlePasswordType = () => {
    setPasswordType(!passwordType);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to login. Please try again.');
      }

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify({
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        role: result.user.role,
        profileCompleted: result.user.profileCompleted,
        paymentCompleted: result.user.paymentCompleted,
        token: result.token,
      }));

      // Check email verification status
      if (!result.user.emailVerified) {
        setShowVerificationModal(true);
        return;
      }

      // Redirect based on profile and payment status
      if (!result.user.profileCompleted) {
        navigate('/complete-profile');
        return;
      }

      if (!result.user.paymentCompleted) {
        navigate('/payment');
        return;
      }

      // Navigate based on user role
      switch (result.user.role?.toLowerCase()) {
        case 'mentor':
          navigate('/mentor-dashboard');
          break;
        case 'mentee':
          navigate('/mentee-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          console.error('Invalid user role:', result.user.role);
          setError('Invalid user role. Please contact support.');
          break;
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <section className="relative flex h-full">
      <div className="hidden lg:block h-full w-3/5">
        <img src="/image/people-office-work-day 1.png" loading="lazy" className="h-full w-full object-cover" alt="" />
        <div onClick={() => navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" loading="lazy" className="w-40" alt="" />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col lg:flex-row items-center w-full lg:w-2/5 justify-center">
        <div onClick={() => navigate('/')} className="block lg:hidden bg-black py-2 px-2">
          <img src="/image/LogoAyth.png" loading="lazy" className="w-40" alt="" />
        </div>
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className="text-2xl font-bold lg:text-[40px] text-customDarkBlue">Sign In</h1>
          <p className="text-slate-400 text-sm mt-5">Welcome back! please enter your detail</p>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mt-4">
              <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
                <span>
                  <FontAwesomeIcon className="text-gray-400 text-xl" icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'This field is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="outline-none w-full"
                  placeholder="Email"
                />
              </div>
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
                <div className="flex items-center justify-center gap-3">
                  <span>
                    <FontAwesomeIcon className="text-gray-400 text-xl" icon={faLock} />
                  </span>
                  <input
                    type={passwordType ? 'text' : 'password'}
                    {...register('password', {
                      required: 'This field is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                    className="outline-none w-full"
                    placeholder="Enter Password"
                  />
                </div>
                <span onClick={handlePasswordType} className="cursor-pointer">
                  {passwordType ? (
                    <FontAwesomeIcon className="text-gray-400 text-lg" icon={faEye} />
                  ) : (
                    <FontAwesomeIcon className="text-gray-400 text-lg" icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>

            <div className="mt-4">
              <button 
                type="submit" 
                className="text-white bg-customOrange w-full h-11 lg:h-14 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
              >
                Sign In
              </button>
            </div>

            <div className='md:flex w-full justify-between mt-6'>
              <div className='text-sm text-customOrange font-medium'>
                <Link to={'/forgot-password'}>Forgot Password?</Link>
              </div>
              <div className='flex'>
                <p className='text-sm font-medium'>Don't have an account?</p>
                <Link to={'/sign-up'} className='text-sm text-customOrange font-medium ml-1'>Sign Up</Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-2xl text-yellow-500" />
              <h2 className="text-xl font-bold">Email Verification Required</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Your email address has not been verified yet. Please check your inbox for the verification link or request a new one.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowVerificationModal(false);
                  navigate('/verify-email');
                }}
                className="bg-customOrange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Verify Email
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SignIn;