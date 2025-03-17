import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';

function StepThree() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();


    const detailsForm = watch()


    useEffect(() => {
        localStorage.setItem('loginFormData', JSON.stringify(detailsForm));
    }, [detailsForm]);


    useEffect(() => {
        const savedFormData = localStorage.getItem('loginFormData');
        if (savedFormData) {
            const parsedFormData = JSON.parse(savedFormData);
            setValue('email', parsedFormData.email);
            setValue('password', parsedFormData.password);
        }
    }, [setValue]);

    const onSubmit = () => {
           handleIncreament()
    }


    const { handleIncreament, handleDecreament } = useContext(GlobalContext)
    return (
        <div className=' lg:w-[400px]'>
            <div onClick={handleDecreament}>
                <button className=' w-10 flex justify-center items-center text-slate-200 h-10 bg-slate-400 rounded-full '>
                    <FontAwesomeIcon className=' text-2xl' icon={faArrowLeft} />
                </button>
            </div>
            <p className=' text-base  text-center font-medium mt-6'>STEP 3 of 4</p>

            <progress className=' bg-customOrange h-2' value="80" max="100" ></progress>

            <h1 className=' mt-7 text-[36px] font-medium'>Select areas of Interest</h1>

            <div>

            </div>
            <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
             
              
            <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
                <div className="flex items-center gap-4">
                  <img src="/image/iconmode.png" className="w-9" alt="" />
                  <p className="text-base font-medium">Join as Mentor</p>
                </div>
                <input
                  type="checkbox"
                  className="accent-customOrange text-white w-6 h-4 cursor-pointer"
                />
              </div>


            
              <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
                <div className="flex items-center gap-4">
                  <img src="/image/iconmode.png" className="w-9" alt="" />
                  <p className="text-base font-medium">Join as Mentor</p>
                </div>
                <input
                  type="checkbox"
                  className="accent-customOrange text-white w-6 h-4 cursor-pointer"
                />
              </div>

                
              <div className="flex justify-between border-2 rounded-lg p-4 items-center gap-2">
                <div className="flex items-center gap-4">
                  <p className="text-base font-medium">Join as Mentor</p>
                </div>
                <input
                  type="checkbox"
                  className="accent-customOrange text-white w-6 h-4 cursor-pointer"
                />
              </div>



            </form>

            <button  type='submit' className=' mt-4 w-full h-14 rounded-lg cursor-pointer text-white bg-customOrange'>Continue</button>
        </div>
    );
}

export default StepThree;