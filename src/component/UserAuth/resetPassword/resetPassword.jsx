import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, } from '@fortawesome/free-solid-svg-icons';



function ResetPassWord() {


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();


  const formData = watch();


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
        <h1 className="text-[40px] text-customDarkBlue">Reset Password</h1>
      <p className="text-slate-400 text-sm mt-2">Welcome back! Please enter your details</p>
      <form type={handleSubmit(onSubmit)}>
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

  
            <div className="mt-4">
              <button type="submit" className="text-white bg-customOrange w-full h-14 rounded-lg cursor-pointer">
                Reset Password
              </button>
            </div>
          </form>
        </div>
     </div>


       <div>
        
       </div>
                   
    </section>
  );
}

export default ResetPassWord;