import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function StepFour() {
  const navigate = useNavigate();
  const { handleDecreament } = useContext(GlobalContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('stepFourData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('bio', parsedFormData.bio);
      setValue('overview', parsedFormData.overview);
    }
  }, [setValue]);

  // Save form data to localStorage whenever it changes
  const onFormChange = (data) => {
    const stepFourData = {
      bio: data.bio,
      overview: data.overview
    };
    localStorage.setItem('stepFourData', JSON.stringify(stepFourData));
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      // Get all form data from localStorage
      const stepOneData = JSON.parse(localStorage.getItem('stepOneData') || '{}');
      const stepTwoData = JSON.parse(localStorage.getItem('stepTwoData') || '{}');
      const stepThreeData = JSON.parse(localStorage.getItem('stepThreeData') || '{}');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (!userData.email) {
        throw new Error('No user data found. Please sign up again.');
      }

      // Format social media links
      const socialLinks = {
        linkedIn: stepTwoData.linkedIn || '',
        twitter: stepTwoData.twitter || '',
        instagram: stepTwoData.instagram || '',
        website: stepTwoData.website || ''
      };

      // Format expertise array
      const expertiseArray = stepTwoData.expertise ? 
        (Array.isArray(stepTwoData.expertise) ? stepTwoData.expertise : [stepTwoData.expertise]) : 
        [];

      // Combine all form data
      const profileData = {
        // Basic user data
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'mentor',
        password: userData.password,

        // Step One Data - Use the local server URL
        profilePicture: stepOneData.profilePicture || '',
        gender: stepOneData.gender || '',

        // Step Two Data
        title: stepTwoData.Title || '',
        expertise: stepTwoData.expertise || [],
        experience: stepTwoData.experience || '',
        social: socialLinks,

        // Step Three Data
        interests: stepThreeData.selectedInterests || [],

        // Step Four Data
        bio: data.bio || '',
        overview: data.overview || '',
        profileCompleted: true,
        mentorshipStatus: 'available'
      };

      // Log the data being sent
      console.log('Submitting profile data:', profileData);

      // Use the api instance to complete profile
      const response = await userApi.completeProfile(profileData);

      if (response.success) {
        // Clear all stored data after successful update
        localStorage.removeItem('userData');
        localStorage.removeItem('stepOneData');
        localStorage.removeItem('stepTwoData');
        localStorage.removeItem('stepThreeData');
        localStorage.removeItem('stepFourData');

        // Navigate to payment page
        navigate('/payment');
      } else {
        setError(response.message || 'Failed to complete profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      setError(error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 lg:px-0 md:w-[400px]">
      {/* Back Button */}
      <div onClick={handleDecreament}>
        <button className="w-10 flex justify-center items-center text-slate-200 h-10 bg-slate-400 rounded-full">
          <FontAwesomeIcon className="text-2xl" icon={faArrowLeft} />
        </button>
      </div>

      {/* Step Indicator */}
      <p className="text-base text-center font-medium mt-4 lg:mt-6">STEP 4 of 4</p>

      {/* Progress Bar */}
      <progress className="bg-customOrange h-2" value="80" max="100"></progress>

      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] w-full sm:w-auto lg:w-[490px] font-semibold text-customDarkBlue">Complete Your Profile</h1>
      <p className="text-slate-400 text-sm mt-5">Please provide your bio information</p>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form className="mt-5" onSubmit={handleSubmit(handleFormSubmit)} onChange={handleSubmit(onFormChange)}>
        {/* Bio Field */}
        <div className="mt-4">
          <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
            <textarea
              {...register('bio', { 
                required: 'Bio is required',
                minLength: {
                  value: 50,
                  message: 'Bio must be at least 50 characters long'
                },
                maxLength: {
                  value: 500,
                  message: 'Bio must not exceed 500 characters'
                }
              })}
              className="outline-none w-full min-h-[120px] resize-none"
              placeholder="Tell us about yourself, your experience, and what you can offer as a mentor..."
            />
          </div>
          {errors.bio && <p className="text-red-600">{errors.bio.message}</p>}
        </div>

        {/* Overview Field */}
        <div className="mt-4">
          <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
            <textarea
              {...register('overview')}
              className="outline-none w-full min-h-[120px] resize-none"
              placeholder="Provide a brief overview of your professional experience and achievements..."
            />
          </div>
        </div>

        <div className="mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`text-white bg-customOrange w-full h-11 lg:h-14 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Completing Profile...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StepFour;