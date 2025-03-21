import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash,  } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const [passwordType, setPasswordType] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const formData = watch();

  console.log(formData);

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

  // Toggle password visibility
  const handlePasswordType = () => {
    setPasswordType(!passwordType);
  };

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form Data:', data);
    if (data) {
      navigate('/mode-of-registering'); 
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
      <div className="flex  flex-col lg:flex-row  items-center w-full lg:w-2/5 justify-center">
      <div onClick={() => navigate('/')} className=" block lg:hidden bg-black py-2 px-2">
                    <img src="/image/LogoAyth.png" loading="lazy" className="w-40" alt="" />
     </div>
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className="text-2xl font-bold lg:text-[40px] text-customDarkBlue">Sign In</h1>
          <p className="text-slate-400 text-sm  mt-5">Welcome back! please enter your detail</p>

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>


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
                        value: 8,
                        message: 'Password must be at least 8 characters long',
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
              <button type="submit" className="text-white bg-customOrange w-full h-11 lg:h-14 rounded-lg cursor-pointer">
                Sign In
              </button>
            </div>

            <div className='md:flex w-full  justify-between mt-6 '>
              <div className=' text-sm text-customOrange font-medium'>
                 <Link to={'/change-password'}>Forgot Password?</Link>
              </div>
              <div className=' flex '>
             <p className=' text-sm font-medium'>Don’t have an account?</p>  
              <Link to={'/sign-up'} className=' text-sm text-customOrange font-medium'>Sign Up</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;