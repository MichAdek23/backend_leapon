import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';

function Step3() {
  const { handleIncreament, handleDecreament } = useContext(GlobalContext);

  const {
  
    handleSubmit,
    watch,
    setValue,
   
  } = useForm();

  const detailsForm = watch();

  // State to track the selected checkbox
  const [selectedInterest, setSelectedInterest] = useState('');

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loginFormData', JSON.stringify(detailsForm));
  }, [detailsForm]);

  useEffect(() => {
    const savedFormData = localStorage.getItem('loginFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setValue('selectedInterest', parsedFormData.selectedInterest);
      setSelectedInterest(parsedFormData.selectedInterest); // Sync the state with the form value
    }
  }, [setValue]);

  // Handle checkbox change
  const handleCheckboxChange = (interest) => {
    setSelectedInterest(interest); 
    setValue('selectedInterest', interest); // Update the form value
  };

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
      <p className="text-base text-center font-medium ">STEP 3 of 4</p>

      {/* Progress Bar */}
      <progress className="bg-customOrange h-2" value="80" max="100"></progress>

      {/* Form Title */}
      <h1 className="mt-7 text-xl lg:text-[36px] font-medium">Select areas of Interest</h1>

      {/* Form */}
      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Academics Checkbox */}
        <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
          <div className="flex items-center gap-4">
            <p className="text-base font-medium">Academics</p>
          </div>
          <input
            type="checkbox"
            checked={selectedInterest === 'academics'}
            onChange={() => handleCheckboxChange('academics')}
            className="accent-customOrange text-white w-6 h-4 cursor-pointer"
          />
        </div>

        {/* Business/Entrepreneurship Checkbox */}
        <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
          <div className="flex items-center gap-4">
            <p className="text-base font-medium">Business/Entrepreneurship</p>
          </div>
          <input
            type="checkbox"
            checked={selectedInterest === 'business'}
            onChange={() => handleCheckboxChange('business')}
            className="accent-customOrange text-white w-6 h-4 cursor-pointer"
          />
        </div>

        {/* Career Guidance Checkbox */}
        <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
          <div className="flex items-center gap-4">
            <p className="text-base font-medium">Career Guidance</p>
          </div>
          <input
            type="checkbox"
            checked={selectedInterest === 'career'}
            onChange={() => handleCheckboxChange('career')}
            className="accent-customOrange text-white w-6 h-4 cursor-pointer"
          />
        </div>

        {/* Christ-like Discipleship Checkbox */}
        <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
          <div className="flex items-center gap-4">
            <p className="text-base font-medium">Christ-like Discipleship</p>
          </div>
          <input
            type="checkbox"
            checked={selectedInterest === 'discipleship'}
            onChange={() => handleCheckboxChange('discipleship')}
            className="accent-customOrange text-white w-6 h-4 cursor-pointer"
          />
        </div>

        {/* Personal Development and Leadership Checkbox */}
        <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
          <div className="flex items-center gap-4">
            <p className="text-base font-medium">Personal Development and Leadership</p>
          </div>
          <input
            type="checkbox"
            checked={selectedInterest === 'personalDevelopment'}
            onChange={() => handleCheckboxChange('personalDevelopment')}
            className="accent-customOrange text-white w-6 h-4 cursor-pointer"
          />
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

export default Step3;