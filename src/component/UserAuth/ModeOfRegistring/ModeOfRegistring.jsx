import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

function ModeOfSignUp() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); 

  const {
  
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const formData = watch();

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('passwordFormData', JSON.stringify(formData));
  }, [formData]);

 
  useEffect(() => {
    const savedFormData = localStorage.getItem('passwordFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('role', parsedFormData.role); 
      setSelectedRole(parsedFormData.role); 
    }
  }, [setValue]);

  // Handle checkbox change
  const handleRoleChange = (role) => {
    setSelectedRole(role); 
    setValue('role', role); 
  };

  console.log(selectedRole)


  const onSubmit = (data) => {
    console.log('Form Data:', data);
      if (selectedRole === 'mentee') {
         navigate('/MenteeForm')
         return;
      }
    console.log(selectedRole)
  };

  return (
    <section className="relative flex h-full">
      {/* Left Side Image */}
      <div className="hidden lg:block h-full w-3/5">
        <img src="/image/people-office-work-day-1.png" className="h-full w-full object-cover" alt="" />
        <div onClick={() => navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" className="w-40" alt="" />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col lg:flex-row  items-center w-full lg:w-2/5 justify-center">
      <div onClick={() => navigate('/')} className=" block lg:hidden bg-black py-2 px-2">
                    <img src="src\assets\image\LogoAyth.png" className="w-40" alt="" />
     </div>
        <div className="w-full px-6 lg:px-0 md:w-[400px]">
          <h1 className=" text-xl  md:text-2xl font-bold lg:text-[30px] text-customDarkBlue">Welcome to Mentorship</h1>

          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Selection */}
            <div className="flex flex-col gap-4 mt-4">
          
              <div className="flex justify-between border-2 rounded-lg p-2 lg:p-4 items-center">
                <div className="flex items-center gap-4">
                  <img src="src\assets\image\iconmode.png" className="w-9" alt="" />
                  <p className="text-base font-medium">Join as Mentee</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedRole === 'mentee'}
                  onChange={() => handleRoleChange('mentee')}
                  className="accent-customOrange text-white w-6 h-4 cursor-pointer"
                />
              </div>

            
              <div className="flex justify-between border-2 rounded-lg p-2 lg:p-4 items-center gap-2">
                <div className="flex items-center gap-4">
                  <img src="src\assets\image\iconmode.png" className="w-9" alt="" />
                  <p className="text-base font-medium">Join as Mentor</p>
                </div>

                <input
                  type="checkbox"
                  checked={selectedRole === 'mentor'}
                  onChange={() => handleRoleChange('mentor')}
                  className="accent-customOrange text-white w-6 h-4 cursor-pointer"
                />
              </div>
            </div>
            {errors.role && <p className="text-red-600">{errors.role.message}</p>}

            {/* Submit Button */}
            <div className="mt-4">
              <button type="submit" className="text-white bg-customOrange w-full h-11 lg:h-14 rounded-lg cursor-pointer">
                Continue
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-[30px] text-center flex justify-center text-sm font-medium text-customDarkBlue">
            Already have an account?
            <span className="text-customOrange ms-3">
              <Link to={'/Login'}>Login</Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModeOfSignUp;