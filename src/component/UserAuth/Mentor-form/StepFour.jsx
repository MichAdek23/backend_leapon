import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import { useNavigate } from 'react-router-dom';

function StepFour() {
  const navigate = useNavigate();
  const { formData } = useContext(GlobalContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      // Get the stored user data
      const storedUserData = JSON.parse(localStorage.getItem('userData'));
      if (!storedUserData || !storedUserData.token) {
        throw new Error('No user data found. Please sign up again.');
      }

      // Combine profile update data with stored user data
      const profileData = {
        firstName: storedUserData.firstName,
        lastName: storedUserData.lastName,
        email: storedUserData.email,
        role: storedUserData.role,
        bio: data.bio,
        interests: formData.selectedInterests || [],
        title: formData.Title || '',
        socialMediaLinks: formData.SocialMediaLinks || '',
        profilePicture: formData.profilePicture || '',
        gender: formData.gender || ''
      };

      // Send data to backend for profile completion
      const response = await fetch('https://leapon.onrender.com/api/users/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUserData.token}`
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile completion failed');
      }

      // Clear all stored data after successful update
      localStorage.removeItem('userData');
      localStorage.removeItem('formData');
      localStorage.removeItem('loginFormData');

      // Navigate to payment page
      navigate('/payment');
    } catch (error) {
      console.error('Profile completion error:', error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  return (
    <div className="w-full px-6 lg:px-0 md:w-[400px]">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] w-full sm:w-auto lg:w-[490px] text-customDarkBlue">Complete Your Profile</h1>
      <p className="text-slate-400 text-sm mt-5">Please provide your bio information</p>

      <form className="mt-5" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Bio Field */}
        <div className="mt-4">
          <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
            <span>
              <FontAwesomeIcon className="text-gray-400 text-xl" icon={faUser} />
            </span>
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

        <div className="mt-4">
          <button 
            type="submit" 
            className="text-white bg-customOrange w-full h-11 lg:h-14 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
}

export default StepFour;