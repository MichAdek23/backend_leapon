import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';

function Step2() {
  const { handleIncreament, handleDecreament } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const detailsForm = watch();

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(detailsForm));
  }, [detailsForm]);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('loginFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('name', parsedFormData.name);
      setValue('Title', parsedFormData.Title);
      setValue('SocialMediaLinks', parsedFormData.SocialMediaLinks);
    }
  }, [setValue]);

  // Handle form submission
  const onSubmit = () => {
    handleIncreament(); // Move to the next step
  };

  return (
    <div className=" text-center lg:text-start w-[300px] lg:w-[400px]">
      {/* Back Button */}
      <div onClick={handleDecreament}>
        <button className="w-10 flex justify-center items-center text-slate-200 h-10 bg-slate-400 rounded-full">
          <FontAwesomeIcon className="text-2xl" icon={faArrowLeft} />
        </button>
      </div>

      {/* Step Indicator */}
      <p className="text-base text-center font-medium mt-4 lg:mt-6">STEP 2 of 4</p>

     
      <progress className="bg-customOrange h-2" value="40" max="100"></progress>

  
      <h1 className="mt-7 text-xl lg:text-[36px] font-medium">Complete Profile Details</h1>

      <form className=" flex gap-4 flex-col mt-10" onSubmit={handleSubmit(onSubmit)}>
   
        <div>
          <div className="flex relative items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2">
            <input
              type="text"
              {...register('name', { required: 'This field is required' })}
              className="outline-none w-full"
              placeholder="E.G Sam Eke"
            />
            <p className="absolute -top-3 left-4 bg-white px-1 text-base font-bold text-slate-400">
              Your Name
            </p>
          </div>
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
            <div className="relative flex items-center w-full justify-center gap-3">
              <input
                type="text"
                {...register('Title', { required: 'This field is required' })}
                className="outline-none w-full"
                placeholder="E.G Doctor"
              />
              <p className="absolute -top-7 left-2 bg-white px-1 text-base font-bold text-slate-400">
                Your Title
              </p>
            </div>
          </div>
          {errors.Title && <p className="text-red-600">{errors.Title.message}</p>}
        </div>

        {/* Social Media Links Field */}
        <div>
          <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
            <div className="relative flex items-center justify-center w-full gap-3">
              <input
                type="text"
                {...register('SocialMediaLinks', { required: 'This field is required' })}
                className="outline-none w-full"
                placeholder="E.G LinkedIn URL"
              />
              <p className="absolute -top-7 left-2 bg-white px-1 text-base font-bold text-slate-400">
               Social Media Links
              </p>
            </div>
          </div>
          {errors.SocialMediaLinks && (
            <p className="text-red-600">{errors.SocialMediaLinks.message}</p>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="mt-4 w-full h-11 lg:h-14 rounded-lg cursor-pointer text-white bg-customOrange"
        >
          Continue
        </button>

      </form>
    </div>
  );
}

export default Step2;