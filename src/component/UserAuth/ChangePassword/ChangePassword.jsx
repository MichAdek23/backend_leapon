import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


function ChangePassword() {
  const [passwordType, setPasswordType] = useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = useState(false);

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const formData = watch();

  useEffect(() => {
    localStorage.setItem('passwordFormData', JSON.stringify(formData));
  }, [formData]);


  useEffect(() => {
    const savedFormData = localStorage.getItem('passwordFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('email', parsedFormData.email);
      setValue('password', parsedFormData.password);
      setValue('confirmPassword', parsedFormData.confirmPassword);
    }
  }, [setValue]);


  const handlePasswordType = () => {
    setPasswordType(!passwordType);
  };


  const handleConfirmPasswordType = () => {
    setConfirmPasswordType(!confirmPasswordType);
  };


  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    } else{
        navigate('/Login')
    }
    console.log('Form Data:', data);
   
  };

  return (
    <section className="relative flex h-full">
      {/* Left Side Image */}
      <div className="hidden lg:block h-full w-3/5">
        <img src="/image/people-office-work-day-1.png" loading="lazy" className="h-full w-full object-cover" alt="" />
        <div onClick={()=> navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" loading="lazy" className=" w-40" alt="" />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex items-center w-full lg:w-2/5 justify-center">
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className=" text-2xl font-bold lg:text-[40px] text-customDarkBlue">Change Password</h1>
          <p className="text-slate-400 text-sm mt-2">Welcome back! Please enter your details</p>

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          

            {/* Password Field */}
            <div>
              <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
                <div className="flex items-center justify-center gap-3">
                  <span>
                    <FontAwesomeIcon className="text-gray-400 text-xl" icon={faLock} />
                  </span>
                  <input
                    type={passwordType ? 'text' : 'password'}
                    {...register('password', { required: 'This field is required' })}
                    className="outline-none w-full"
                    placeholder="Enter New Password"
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

           
            <div>
              <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
                <div className="flex items-center justify-center gap-3">
                  <span>
                    <FontAwesomeIcon className="text-gray-400 text-xl" icon={faLock} />
                  </span>
                  <input
                    type={confirmPasswordType ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'This field is required',
                      validate: (value) => value === watch('password') || 'Passwords do not match',
                    })}
                    className="outline-none w-full"
                    placeholder="Confirm New Password"
                  />
                </div>
                <span onClick={handleConfirmPasswordType} className="cursor-pointer">
                  {confirmPasswordType ? (
                    <FontAwesomeIcon className="text-gray-400 text-lg" icon={faEye} />
                  ) : (
                    <FontAwesomeIcon className="text-gray-400 text-lg" icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button type="submit" className="text-white bg-customOrange w-full h-14 rounded-lg cursor-pointer">
                Change Password
              </button>
            </div>
          </form>

   
        </div>
      </div>
    </section>
  );
}

export default ChangePassword;