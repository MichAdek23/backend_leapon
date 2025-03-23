import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faCalendar } from '@fortawesome/free-solid-svg-icons';

function StepFour({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="w-full px-6 lg:px-0 md:w-[400px]">
      <h1 className="text-2xl font-bold lg:text-[40px] text-customDarkBlue">Complete Your Profile</h1>
      <p className="text-slate-400 text-sm mt-5">Please provide your academic information</p>

      <form className="mt-5" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Department Field */}
        <div className="mt-4">
          <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
            <span>
              <FontAwesomeIcon className="text-gray-400 text-xl" icon={faGraduationCap} />
            </span>
            <input
              type="text"
              {...register('department', { 
                required: 'Department is required',
                minLength: {
                  value: 2,
                  message: 'Department name must be at least 2 characters long'
                }
              })}
              className="outline-none w-full"
              placeholder="Department"
            />
          </div>
          {errors.department && <p className="text-red-600">{errors.department.message}</p>}
        </div>

        {/* Year of Study Field */}
        <div className="mt-4">
          <div className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
            <span>
              <FontAwesomeIcon className="text-gray-400 text-xl" icon={faCalendar} />
            </span>
            <input
              type="text"
              {...register('yearOfStudy', { 
                required: 'Year of study is required',
                pattern: {
                  value: /^[1-4]$/,
                  message: 'Year must be between 1 and 4'
                }
              })}
              className="outline-none w-full"
              placeholder="Year of Study (1-4)"
            />
          </div>
          {errors.yearOfStudy && <p className="text-red-600">{errors.yearOfStudy.message}</p>}
        </div>

        <div className="mt-4">
          <button 
            type="submit" 
            className="text-white bg-customOrange w-full h-11 lg:h-14 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default StepFour;