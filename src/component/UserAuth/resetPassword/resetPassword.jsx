import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ResetConfirmation from './resetConfirmation';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';

function ResetPassWord() {

  const { otpshow, ShowResetConfirmation } = useContext(GlobalContext); // Properly use GlobalContext

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const formData = watch();

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(formData));
  }, [formData]);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('loginFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('email', parsedFormData.email);
      setValue('password', parsedFormData.password);
    }
  }, [setValue]);

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form Data:', data);
    ShowResetConfirmation() 
    
  };

  return (
    <section className="relative flex h-full">
    
      {otpshow && (
        <section className={` absolute md:left-[600px] lg:left-[400px] xl:left-[600px] p-3 bg-slate-600 h-full w-full bg-opacity-10`}>
          <ResetConfirmation />
        </section>
      )}

      <div className="hidden lg:block h-full w-3/5">
        <img
          src="image/young-people-working-from-modern-place 1.png"
          className="h-full w-full object-cover"
          alt=""
        />
        <div className="absolute top-4">
          <img src="/image/LogoAyth.png" className="w-64" alt="Logo" />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex items-center w-full lg:w-2/5 justify-center">
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className="text-[40px] text-customDarkBlue">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-2">
            Welcome back! Please enter your details
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mt-4">
              <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
                <span>
                  <FontAwesomeIcon className="text-gray-400 text-xl" icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  {...register('email', { required: 'This field is required' })}
                  className="outline-none w-full"
                  placeholder="Email"
                />
              </div>
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="text-white bg-customOrange w-full h-14 rounded-lg cursor-pointer"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassWord;