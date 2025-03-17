import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

function SignUp() {
  const [passwordType, setPasswordType] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();


  const formData = watch();

  console.log(formData)


  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(formData));
  }, [formData]);

  
  useEffect(() => {
    const savedFormData = localStorage.getItem('loginFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('email', parsedFormData.email);
      setValue('password', parsedFormData.password);
    }
  }, [setValue]);

  const handlePasswordType = () => {
    setPasswordType(!passwordType);
  };

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    
  };

  return (
    <section className="relative flex h-full">
      <div className="hidden lg:block h-full w-3/5">
        <img src="/image/young-people-working-from-modern-place 1.png" className="h-full w-full object-cover" alt="" />
        <div className="absolute top-4">
          <img src="/image/LogoAyth.png" className="w-64" alt="" />
        </div>
      </div>

      <div className="flex items-center w-full lg:w-2/5 justify-center">
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className="text-[40px] text-customDarkBlue">Sign Up</h1>
          <p className="text-slate-400 text-sm mt-2">Let’s Create an Account for you</p>

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name icon */}
            <div className=' flex items-center gap-3'>
            <div className=' w-1/2'>
              <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
                <span>
                  <FontAwesomeIcon className="text-gray-400 text-xl" icon={faPerson} />
                </span>
                <input
                  type="text"
                  {...register('FirstName', { required: 'This field is required' })}
                  className="outline-none w-full"
                  placeholder="First Name"
                />
              </div>
              {errors.text && <p className="text-red-600">{errors.text.message}</p>}
            </div>


            <div className=' w-1/2'>
              <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
                <span>
                  <FontAwesomeIcon className="text-gray-400 text-xl" icon={faPerson} />
                </span>
                <input
                  type="text"
                  {...register('lastName', { required: 'This field is required' })}
                  className="outline-none w-full"
                  placeholder="Last Name"
                />
              </div>
              {errors.text && <p className="text-red-600">{errors.text.message}</p>}
            </div>
            </div>


            {/* Email Field */}
            <div className=' mt-4'>
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
                    {...register('password', { required: 'This field is required',   minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long',
                 } })}
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

            <p className=' mt-6 text-gray-600'>Your password must have at least 8 characters</p>


           {/* terms and condition */}


           <div className=' mt-6 flex items-center gap-4'>
              <input type="checkbox" 
               {...register('terms', { required: 'You must accept the terms and conditions' })}
                className=' accent-customOrange   text-white cursor-pointer w-4 h-4' name="" id="" />
            <p className=' text-sm font-medium  text-slate-400'>By creating an account means you agree to the <b className=' text-slate-900'>Terms <br />
            & Conditions</b>  and our <b className=' text-slate-900'>Privacy Policy</b> </p>
           </div>
               

            {/* Submit Button */}
            <div className="mt-4">
              <button type="submit" className="text-white bg-customOrange  w-full h-14 rounded-lg cursor-pointer">
                Sign up
              </button>
            </div>
          </form>

          <p className=' mt-[30px]  text-center text-sm font-medium text-customDarkBlue'>Already have an account? Log In <span className=' text-customOrange'><Link to={'/Login'}>Login</Link></span></p>
        

       
        </div>
      </div>
    </section>
  );
}

export default SignUp;